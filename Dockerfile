FROM node:14

ADD . /app
WORKDIR /app
RUN yarn install --frozen-lockfile
USER node
ENTRYPOINT ["yarn", "start"]