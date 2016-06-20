FROM node:6-onbuild

RUN npm install -g nodemon
CMD [ "nodemon", "app.js" ]

EXPOSE 8300
