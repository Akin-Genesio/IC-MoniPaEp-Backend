FROM node:14.2

WORKDIR /app

COPY ./package.json .
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE 3333

# CMD npm start
CMD [ "yarn", "dev" ]
