FROM node:lts-alpine as builder

COPY . /home/node/app

WORKDIR /home/node/app
RUN npm install && npm run build

FROM node:lts-alpine

COPY --from=builder /home/node/app/dist /home/node/app/dist
RUN npm install -g http-server

EXPOSE 8080

WORKDIR /home/node/app
CMD [ "http-server" , "dist" ]
