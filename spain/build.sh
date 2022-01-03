#!/bin/sh

docker stop visa-bot
docker rm visa-bot
docker rmi secretcolossus/visa-bot:latest

docker build -t secretcolossus/visa-bot:latest .

#docker push secretcolossus/delen:latest