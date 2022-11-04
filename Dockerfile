FROM node:12.18.1
EXPOSE 3000
WORKDIR /app
COPY ["/app/notsosmart/package.json", "/app/notsosmart/package-lock.json*", "./"]
RUN npm install --save
RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
COPY ./app/notsosmart .
RUN chmod -R 555 /app
RUN useradd -ms /bin/bash admin
USER admin
CMD [ "sh", "start.sh" ]
