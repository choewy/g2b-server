#!/bin/bash

source /home/ubuntu/g2b/manifest

if [ "$(sudo docker container inspect --format '{{.Name}}' g2b 2>&1)" == "/g2b" ]; then
  container_id=`sudo docker rm -f g2b`
  echo "remove container $container_id"
fi

image_id="$(sudo docker images --filter=reference=*/$repository:$tag --format "{{.ID}}")"

sudo docker run \
  --name g2b -d \
  -p 7000:4000 \
  -v /home/ubuntu/logs:/var/app/logs \
  --network=net \
  --restart=always \
  $image_id

exit 0