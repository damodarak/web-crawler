FROM node:18

WORKDIR /app
COPY package*.json ./

RUN npm ci --production

COPY . .

RUN npm run build
ENV NODE_ENV production

EXPOSE 3000
CMD ["npm", "start"]