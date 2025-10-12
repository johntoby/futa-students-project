#!/bin/bash

set -e  # Exit on any error

echo "🚀 Deploying FUTA Students API to Kubernetes..."

# Install External Secrets Operator
echo "📦 Installing External Secrets Operator..."
helm repo add external-secrets https://charts.external-secrets.io 2>/dev/null || true
helm repo update
if helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace 2>/dev/null; then
    echo "✅ External Secrets Operator installed successfully"
elif helm list -n external-secrets-system | grep -q external-secrets; then
    echo "✅ External Secrets Operator already installed"
else
    echo "❌ Failed to install External Secrets Operator"
    exit 1
fi

# Wait for External Secrets CRDs to be ready
echo "⏳ Waiting for External Secrets CRDs..."
echo "Checking available CRDs..."
kubectl get crd | grep external-secrets || echo "No external-secrets CRDs found"

# Wait for ESO pods to be ready first
echo "Waiting for External Secrets Operator pods..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=external-secrets -n external-secrets-system --timeout=120s

# Wait a bit more for CRDs to be registered
sleep 10

# Check CRDs again
if kubectl get crd secretstores.external-secrets.io && kubectl get crd externalsecrets.external-secrets.io; then
    echo "✅ External Secrets CRDs are ready"
else
    echo "❌ External Secrets CRDs not found, checking what's available:"
    kubectl get crd | grep external
    exit 1
fi

# Deploy Vault
echo "🔐 Deploying Vault..."
if kubectl apply -f vault/vault.yml; then
    echo "✅ Vault deployed successfully"
else
    echo "❌ Failed to deploy Vault"
    exit 1
fi

# Wait for Vault to be ready
echo "⏳ Waiting for Vault to be ready..."
if kubectl wait --for=condition=ready pod -l app=vault -n vault-system --timeout=120s; then
    echo "✅ Vault is ready"
else
    echo "❌ Vault failed to become ready"
    exit 1
fi

# Configure Vault secrets
echo "🔑 Configuring Vault secrets..."
if kubectl exec -n vault-system deployment/vault -- sh -c 'VAULT_TOKEN=root-token vault kv put secret/database password=postgres123' && \
   kubectl exec -n vault-system deployment/vault -- sh -c 'VAULT_TOKEN=root-token vault kv put secret/application jwt_secret=your-jwt-secret-key'; then
    echo "✅ Vault secrets configured successfully"
else
    echo "❌ Failed to configure Vault secrets"
    exit 1
fi

# Deploy database
echo "🐘 Deploying PostgreSQL database..."
if kubectl apply -f manifests/database.yml; then
    echo "✅ PostgreSQL database deployed successfully"
else
    echo "❌ Failed to deploy PostgreSQL database"
    exit 1
fi

# Deploy External Secrets
echo "🔗 Deploying External Secrets..."
echo "Checking API versions..."
kubectl api-resources | grep external-secrets
echo "Trying to apply external secrets..."
if kubectl apply -f manifests/external-secrets.yml; then
    echo "✅ External Secrets deployed successfully"
else
    echo "❌ Failed to deploy External Secrets"
    echo "Checking supported API versions:"
    kubectl explain secretstore
    exit 1
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
if kubectl wait --for=condition=ready pod -l app=postgres -n student-api --timeout=120s; then
    echo "✅ Database is ready"
else
    echo "❌ Database failed to become ready"
    exit 1
fi

# Build application image
echo "🔨 Building application image..."
cd ..
if docker build -t johntoby/futa-students-api:latest .; then
    echo "✅ Application image built successfully"
    cd k8s
else
    echo "❌ Failed to build application image"
    exit 1
fi

# Deploy application
echo "🌐 Deploying application..."
if kubectl apply -f manifests/application.yml; then
    echo "✅ Application deployed successfully"
else
    echo "❌ Failed to deploy application"
    exit 1
fi

# Wait for application to be ready
echo "⏳ Waiting for application to be ready..."
if kubectl wait --for=condition=ready pod -l app=futa-students-api -n student-api --timeout=120s; then
    echo "✅ Application is ready"
else
    echo "❌ Application failed to become ready"
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "🌍 Application service:"
kubectl get service futa-students-api-service -n student-api
echo "🔍 To access the application, use port-forward:"
echo "kubectl port-forward service/futa-students-api-service 8080:80 -n student-api"