#!/bin/bash

# 使用 apt 安装和升级 docker
# 进行软件源的替换
# 判断是否安装过 Docker，没有安装过软件，则进行指定版本安装，如已经安装过，则将软件升级到指定版本。
# 最后使用 apt-mark 将 docker-ce 锁定在当前安装版本，避免系统其他软件滚动升级时，造成破坏。
DOCKER_VERSION=19.03.6
DOCKER_DEB_VERSION=5:19.03.6~3-0~ubuntu-bionic
DOCKER_NEED_UPGRADED=0
docker(){
    if CHANGE_DOCKER_MIRROR="$(cat /etc/apt/sources.list | grep 'download.docker.com')"; then
        sed -i -e "s/https:\/\/download.docker.com/http:\/\/mirrors.cloud.aliyuncs.com\/docker-ce/" /etc/apt/sources.list
        echo "Docker-ce mirror set."
    fi

    if DOCKER_BINARY_PATH="$(which docker)"; then
        echo "Docker Path: $DOCKER_BINARY_PATH";

        if $(docker --version | grep -q "$DOCKER_VERSION"); then
            echo "Docker is ready for use."
        else
            echo "Docker needs to be upgraded."
            DOCKER_NEED_UPGRADED=1
        fi

        if [ "$DOCKER_NEED_UPGRADED" = "1" ]; then
            apt upgrade docker-ce=$DOCKER_DEB_VERSION -y
            echo "Docker upgraded to $DOCKER_VERSION."
        fi
    else
        echo "Docker is ready to install."
        apt install docker-ce=$DOCKER_DEB_VERSION -y

    fi

    apt-mark hold docker-ce
}


# 更新三方独立二进制软件 docker-compose
COMPOSE_VERSION=1.25.3
COMPOSE_NEED_UPGRADED=1
docker_compose(){
    if COMPOSE_BINARY_PATH="$(which docker-compose)"; then
        echo "Compose Path: $COMPOSE_BINARY_PATH";
    if $(docker-compose --version | grep -q "$COMPOSE_VERSION"); then
        echo "Compose is ready for use."
        COMPOSE_NEED_UPGRADED=0
    else
        echo "Compose needs to be upgraded."
    fi
    fi

    if [ "$COMPOSE_NEED_UPGRADED" = "1" ]; then
        curl -L https://cdn.lab.com/docker-compose -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        echo "Compose upgraded to $DOCKER_VERSION."
        docker-compose --version
    fi
}

# 拉取 traefik docker 镜像
# 先打包: docker save traefik:v2.1.3 -o traefik-v2.1.3.tar
TRAEFIK_VERSION=2.1.3
pull_traefik_image(){
    if [ "$(docker images -q traefik:v$TRAEFIK_VERSION)" = "" ]; then
        curl -L https://cdn.lab.com/traefik-v$TRAEFIK_VERSION.tar -o /tmp/traefik-v$TRAEFIK_VERSION.tar
        docker load -i /tmp/traefik-v$TRAEFIK_VERSION.tar
        rm /tmp/traefik-v$TRAEFIK_VERSION.tar
    fi
    echo "Traefik is ready for use."
}

# 升级系统其他软件
apt update && apt upgrade -y && apt autoremove -y