#!/bin/bash

echo "🚀 Setting up FUTA Students API on Ubuntu VM..."

# Update system
sudo apt-get update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add vagrant user to docker group
sudo usermod -aG docker vagrant

# Start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Make
echo "🔧 Installing Make..."
sudo apt-get install -y make

# Navigate to project directory
cd /home/vagrant/futa-students-project

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Create a startup script
echo "📝 Creating startup script..."
cat > /home/vagrant/start-app.sh << 'EOF'
#!/bin/bash
cd /home/vagrant/futa-students-project
echo "Starting FUTA Students API..."
sudo fuser -k 8080/tcp 2>/dev/null || true
sudo fuser -k 8081/tcp 2>/dev/null || true
sudo fuser -k 8082/tcp 2>/dev/null || true
sudo fuser -k 5432/tcp 2>/dev/null || true
make run-api
EOF

chmod +x /home/vagrant/start-app.sh

echo "✅ Setup complete!"
echo "📝 To start the app, SSH into VM and run: ./start-app.sh"
echo "🌍 Load Balancer: http://localhost:8080"
echo "🔍 API 1: http://localhost:8081"
echo "🔍 API 2: http://localhost:8082"