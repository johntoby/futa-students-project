# Vagrant Deployment

## Prerequisites
- VirtualBox installed
- Vagrant installed

## Usage

### Start VM and Deploy App
```bash
vagrant up
```

### SSH into VM
```bash
vagrant ssh
```

### Stop VM
```bash
vagrant halt
```

### Destroy VM
```bash
vagrant destroy
```

### Restart App in VM
```bash
vagrant ssh
cd futa-students-project
make run-api
```

## Access Points
- Load Balancer: http://localhost:8080
- API 1: http://localhost:8081  
- API 2: http://localhost:8082
- Database: localhost:5432

## Troubleshooting
If the app doesn't start automatically, SSH into the VM and run:
```bash
cd futa-students-project
make run-api
```