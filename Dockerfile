FROM node

WORKDIR /myapp

COPY . .

RUN npm install

EXPOSE 3000


#for container initializing
CMD ["npm","run","dev"]
