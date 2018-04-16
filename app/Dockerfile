FROM node:9.10.0

EXPOSE 8000
CMD [ "npm", "start" ]

WORKDIR /app
COPY package.json /app/
RUN npm install

COPY . /app/
