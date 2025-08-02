FROM node:20

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    cmake \
    libssl-dev \
    libnice-dev \
    libsrtp2-dev \
    libglib2.0-dev \
    pkg-config \
    git \
    openssl \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare yarn@3.2.3 --activate

WORKDIR /app

COPY package.json yarn.lock ./
COPY .yarn/ .yarn/
COPY .yarnrc.yml ./

RUN echo "nodeLinker: node-modules" >> .yarnrc.yml

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
