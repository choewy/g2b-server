#!/bin/bash

source /home/ubuntu/g2b/.profile

sudo docker login -u AWS -p $(aws ecr get-login-password) $registry
sudo docker pull "$registry/$image"

exit 0