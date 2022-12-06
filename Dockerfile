FROM node:16.18.1

RUN apt-get update -y
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -y && apt-get install -y yarn

WORKDIR /konva-app

COPY package.json /konva-app
RUN yarn install
COPY . /konva-app
EXPOSE 5173

CMD yarn dev --host 0.0.0.0
