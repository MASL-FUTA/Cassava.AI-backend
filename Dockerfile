FROM node:18-alpine

WORKDIR /usr/app
COPY package*.json  ./
RUN npm install @nestjs/cli
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build
CMD [ "npm run start:prod" ]
EXPOSE 8080


# FROM node:18-alpine
# # WORKDIR /usr/app
# # COPY package*.json  ./
# # RUN npm install --only=production
# # COPY --from=build /usr/app/dist ./dist
# CMD [ "npm run start:prod" ]
# EXPOSE 8080
