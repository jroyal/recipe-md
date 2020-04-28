FROM node:13-slim

WORKDIR /source/recipe-md

COPY package.json /source/recipe-md

RUN cd /source/recipe-md && npm i

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["sh", "-c", "npm run serve"]