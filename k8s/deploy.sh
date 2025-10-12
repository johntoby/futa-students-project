#!/bin/bash

set -e  # Exit on any error

echo "🚀 Deploying FUTA Students API to Kubernetes..."

# Install External Secrets Operator
echo "📦 Installing External Secrets Operator..."
if helm repo add external-secrets https://charts.external-secrets.io && helm repo update && helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace; then
    echo "✅ External Secrets Operator installed successfully"
else
    echo "❌ Failed to install External Secrets Operator"
    exit 1
fi

# Deploy Vault
echo "🔐 Deploying Vault..."
if kubectl apply -f ./k8s/vault/vault.yml; then
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
if kubectl exec -n vault-system deployment/vault -- vault auth -method=token token=root-token && \
   kubectl exec -n vault-system deployment/vault -- vault kv put secret/database password=postgres123 && \
   kubectl exec -n vault-system deployment/vault -- vault kv put secret/application jwt_secret=your-jwt-secret-key; then
    echo "✅ Vault secrets configured successfully"
else
    echo "❌ Failed to configure Vault secrets"
    exit 1
fi

# Deploy database
echo "🐘 Deploying PostgreSQL database..."
if kubectl apply -f ./k8s/manifests/database.yml; then
    echo "✅ PostgreSQL database deployed successfully"
else
    echo "❌ Failed to deploy PostgreSQL database"
    exit 1
fi

# Deploy External Secrets
echo "🔗 Deploying External Secrets..."
if kubectl apply -f ./k8s/manifests/external-secrets.yml; then
    echo "✅ External Secrets deployed successfully"
else
    echo "❌ Failed to deploy External Secrets"
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
if docker build -t johntoby/futa-students-api:latest .; then
    echo "✅ Application image built successfully"
else
    echo "❌ Failed to build application image"
    exit 1
fi

# Deploy application
echo "🌐 Deploying application..."
if kubectl apply -f ./k8s/manifests/application.yml; then
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