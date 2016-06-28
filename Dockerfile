FROM mhart/alpine-node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . /usr/src/app

RUN apk add --update bash && rm -rf /var/cache/apk/*

RUN npm install
