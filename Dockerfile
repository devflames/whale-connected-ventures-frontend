FROM node:16
## FROM --platform=linux/amd64 
RUN npm install --global node-gyp
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm config set legacy-peer-deps true
RUN npm i
CMD ["npm", "run", "start"]