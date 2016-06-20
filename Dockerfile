FROM node:6-onbuild

RUN npm install -g nodemon
CMD [ "nodemon" ]

EXPOSE 8300
