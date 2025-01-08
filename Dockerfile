FROM node:20.15.1-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]