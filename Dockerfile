FROM node:18-alpine

WORKDIR /usr/app
COPY package*.json  ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate
# RUN npx prisma migrate dev --name init --create-only

COPY . .

# COPY .env ./

RUN npm run build

COPY entrypoint.sh /usr/app/entrypoint.sh
RUN chmod +x /usr/app/entrypoint.sh

# CMD [ "npm run start:dev" ]
ENTRYPOINT [ "/usr/app/entrypoint.sh" ]
