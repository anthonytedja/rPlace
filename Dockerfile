FROM node:18 AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc

FROM node:18
WORKDIR /usr/src/app

COPY package.json .
RUN npm install --production

COPY --from=build /usr/src/app/dist dist
COPY static .

EXPOSE 8080
EXPOSE 8081

CMD [ "node", "dist/serve/main.js"]