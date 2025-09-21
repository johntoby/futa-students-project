Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "futa-students-vm"
  
  # Network configuration
  config.vm.network "forwarded_port", guest: 8080, host: 8080  # Nginx Load Balancer
  config.vm.network "forwarded_port", guest: 8081, host: 8081  # API 1
  config.vm.network "forwarded_port", guest: 8082, host: 8082  # API 2
  config.vm.network "forwarded_port", guest: 5432, host: 5432  # PostgreSQL
  
  # VM configuration
  config.vm.provider "virtualbox" do |vb|
    vb.name = "futa-students-vm"
    vb.memory = "2048"
    vb.cpus = 2
  end
  
  # Sync project folder
  config.vm.synced_folder ".", "/home/vagrant/futa-students-project"
  
  # Provisioning script
  config.vm.provision "shell", path: "vagrant/setup.sh", privileged: false
end