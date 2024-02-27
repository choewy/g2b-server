#!/bin/bash

loop=0
bootstrap=false

while [ $loop -le 5 ]
do
  ((loop++))

  status="$(curl --silent --head -X GET http://localhost:7000 | awk '/^HTTP/{print $2}')"

  if [ "$status" == "200" ]; then
    bootstrap=true
    break
  fi

  sleep 5s
done

if [ $bootstrap == false ]; then
  echo "fail bootstrap"

  exit 1
fi

if [ -d "/home/ubuntu/g2b" ]; then
  rm -rf /home/ubuntu/g2b
fi

sudo docker image prune -a --force
sudo docker container prune --force

exit 0