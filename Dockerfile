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
COPY .env .

EXPOSE 8080
EXPOSE 8081

# For development
CMD ["node", "-r", "dotenv/config", "dist/serve/main.js", "dotenv_config_path=./.env"]

# For production
# CMD ["node", "dist/serve/main.js"]
