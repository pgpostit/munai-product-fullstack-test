FROM node:21-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 5173
CMD ["yarn", "preview"]
