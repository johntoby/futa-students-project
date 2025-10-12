# Kubernetes Deployment

## Prerequisites
- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured
- Helm installed
- Docker for building images

## Directory Structure
```
k8s/
├── manifests/
│   ├── database.yml          # PostgreSQL deployment with namespace, configmap, service
│   ├── application.yml       # API deployment with init container for migrations
│   └── external-secrets.yml  # External Secrets Operator configuration
├── vault/
│   └── vault.yml            # HashiCorp Vault deployment
├── deploy.sh               # Deployment script
└── README.md              # This file
```

## Deployment

### Quick Deploy
```bash
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

### Manual Deploy
1. **Install External Secrets Operator:**
```bash
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace
```

2. **Deploy Vault:**
```bash
kubectl apply -f k8s/vault/vault.yml
```

3. **Configure Vault secrets:**
```bash
kubectl exec -n vault-system deployment/vault -- vault kv put secret/database password=postgres123
```

4. **Deploy Database:**
```bash
kubectl apply -f k8s/manifests/database.yml
```

5. **Deploy External Secrets:**
```bash
kubectl apply -f k8s/manifests/external-secrets.yml
```

6. **Build and Deploy Application:**
```bash
docker build -t futa-students-api:latest .
kubectl apply -f k8s/manifests/application.yml
```

## Access Application
```bash
kubectl port-forward service/futa-students-api-service 8080:80 -n student-api
```

Then access: http://localhost:8080

## Components
- **Namespace:** student-api
- **Database:** PostgreSQL with persistent storage
- **Application:** 2 replicas with init container for migrations
- **Secrets:** Managed by External Secrets Operator + Vault
- **ConfigMaps:** Environment variables
- **Services:** LoadBalancer for external access