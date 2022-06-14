FROM node:12-slim

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium work.
RUN apt-get update \
    && apt-get install -y libglib2.0-0\
        libnss3\
        libnspr4\
        libatk1.0-0\
        libatk-bridge2.0-0\
        libcups2\
        libdrm2\
        libdbus-1-3\
        libxcb1\
        libxkbcommon0\
        libx11-6\
        libxcomposite1\
        libxdamage1\
        libxext6\
        libxfixes3\
        libxrandr2\
        libgbm1\
        libpango-1.0-0\
        libcairo2\
        libasound2\
        libatspi2.0-0\
    && rm -rf /var/lib/apt/lists/*

RUN npm init -y &&  \
    npm i nodemailer node-cron playwright uuid@latest

WORKDIR /app
COPY ./index.js .

CMD ["node", "index.js"]