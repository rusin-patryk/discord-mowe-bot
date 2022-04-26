FROM node:16.14.2

RUN mkdir app
COPY ./ /app
WORKDIR /app

RUN npm install

CMD ["npm", "run", "start"]

EXPOSE 3000