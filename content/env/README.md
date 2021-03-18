## env

一个简单的微服务架构环境

服务后端：Docker
编排工具：docker-compose （不使用的话，直接使用docker原生命令也行）
服务网关：Traefik
具体应用：Nginx + 静态文件 、 compose编排起来的容器应用

### traefik
因为是个人服务，使用的实例越少，模块之间的隔离性越好，今后维护起来的成本就越低，于是我采用最简单的架构：

服务后端：Docker
编排工具：docker-compose （不使用的话，直接使用docker原生命令也行）
服务网关：Traefik
具体应用：Nginx + 静态文件 、 compose编排起来的容器应用