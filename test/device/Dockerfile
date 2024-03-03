FROM node:alpine

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn

COPY . /app

EXPOSE 48899 5577

CMD ["node", "index.js"]
