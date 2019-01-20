FROM node:8-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

ENV DEBUG=stepfunctions-local:*
EXPOSE 4584
CMD ["./bin/stepfunctions-local.js", "start"]