FROM alpine
RUN apk add --update nodejs npm
COPY . /workdir
WORKDIR /workdir
EXPOSE 3000
ENTRYPOINT ["node", "./src/app.js"]
