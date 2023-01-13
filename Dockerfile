FROM node:18.13.0 as build
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY ./ /app
RUN npm run build


FROM httpd:2.4.54
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/