FROM node:8.11.1-alpine

RUN echo "http://dl-2.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories
RUN echo "http://dl-2.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
RUN echo "http://dl-2.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

# install chromium
RUN apk -U --no-cache \
  --allow-untrusted add \
  zlib-dev \
  chromium \
  xvfb \
  wait4ports \
  xorg-server \
  dbus \
  ttf-freefont \
  grep \
  udev \
  && apk del --purge --force linux-headers binutils-gold gnupg zlib-dev libc-utils \
  && rm -rf /var/lib/apt/lists/* \
  /var/cache/apk/* \
  /usr/share/man \
  /tmp/* \
  /usr/lib/node_modules/npm/man \
  /usr/lib/node_modules/npm/doc \
  /usr/lib/node_modules/npm/html \
  /usr/lib/node_modules/npm/scripts

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
ENV NODE_PATH=dist
ENV NODE_ENV=production

# Application specific run commands
RUN npm install -g pm2

ADD . /code

EXPOSE 3000

WORKDIR /code

RUN npm install --production

CMD ["pm2-docker", "start", "/code/dist/launch.js"]