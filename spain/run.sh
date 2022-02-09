#!/bin/sh

docker stop visa-bot
docker rm visa-bot

docker pull secretcolossus/visa-bot:latest

docker run -d --init --name visa-bot secretcolossus/visa-bot:latest node -e "`cat index.js`"