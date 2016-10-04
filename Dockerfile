FROM mhart/alpine-node
RUN apk add --update bash && rm -rf /var/cache/apk/*

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN npm install -g supervisor
COPY package.json /usr/src
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

CMD ["npm", "start"]
