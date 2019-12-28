#!/usr/bin/env bash

function docker_install()
{
  echo "Check docker was installed or not......"
  sudo docker version
  if [ $? -eq 0 ]; then
    echo "Docker was installed"
  else
    echo "Install docker enviroment, waiting moment....."
    curl -sSL https://get.daocloud.io/docker | sh
    echo "Docker install finished, starting docker service...."
    sudo systemctl start docker
  fi
}

function docker_compose_install()
{
  echo "Check docker-compose was installed or not......"
  sudo docker-compose version
  if [ $? -eq 0 ]; then
    echo "Docker-compose was installed"
  else
    echo "Install docker-compose enviroment, waiting moment....."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod a+x /usr/local/bin/docker-compose
    echo "Docker-compose install finished"
  fi
}

function docker_image_exist()
{
  echo "Check platon-evm image exist or not....."
  sudo docker images | grep platon-evm
  if [ $? -eq 0 ]; then
    echo "Docker images existed"
  else
    echo "Build docker image by dockerfile, waiting moment....."
    sudo docker build -t platon-evm:latest .
    echo "Docker image build finished"
  fi
}

SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)
cd ${SHELL_FOLDER}
docker_install
docker_compose_install
sudo mkdir -p /home/juzix/witch/node01/data
sudo cp genesis.json /home/juzix/witch/node01/
sudo cp blskey /home/juzix/witch/node01/data/
sudo cp blspub /home/juzix/witch/node01/data/
sudo cp nodekey /home/juzix/witch/node01/data/
sudo cp pub /home/juzix/witch/node01/data/
cd ../images
docker_image_exist
sudo docker-compose -f docker-compose.yaml up -d