#!/bin/bash

source /home/ubuntu/g2b/manifest

sudo docker login -u AWS -p $(aws ecr get-login-password) $registry
sudo docker pull "$registry/$repository:$tag"

exit 0