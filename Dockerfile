FROM mhart/alpine-node

RUN apk add --update bash && rm -rf /var/cache/apk/*
