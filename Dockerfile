FROM node:21.1.0 as build
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn install
COPY ./ /app
RUN yarn run build


FROM httpd:2.4.54
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/
