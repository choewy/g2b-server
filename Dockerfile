FROM node:20

EXPOSE 4000

WORKDIR /var/g2b

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./dist ./dist
COPY ./.env ./.env

RUN npm ci --omit=dev

CMD ["node", "dist/main.js"]