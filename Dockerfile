# 构建器阶段
# 使用node:current-alpine3.21作为基础镜像
FROM node:current-alpine3.21 AS builder

# 安装git
RUN apk add --no-cache git

# 如果您需要配置git以使用特定的HTTP版本，请确保这是出于必要和安全考虑
RUN git config --global http.version HTTP/1.1

# 创建一个工作目录
WORKDIR /app

# 克隆GitHub仓库到工作目录
RUN git clone https://github.com/hjdhnx/drpy-node.git .

# 设置npm镜像为npmmirror
RUN npm config set registry https://registry.npmmirror.com

# 全局安装pm2工具(yarn已经自带了不需要再自己装)
RUN npm install -g pm2

# 安装项目依赖项和puppeteer
RUN yarn && yarn add puppeteer

# 复制工作目录中的所有文件到一个临时目录中
# 以便在运行器阶段中使用
RUN mkdir /tmp/drpys && cp -r /app/* /tmp/drpys/

# 运行器阶段
# 使用alpine:latest作为基础镜像来创建一个更小的镜像
# 但是无法用pm2
FROM alpine:latest AS runner

# 创建一个工作目录
WORKDIR /app

# 复制构建器阶段中准备好的文件和依赖项到运行器阶段的工作目录中
COPY --from=builder /tmp/drpys /app

# 安装Node.js运行时（如果需要的话，这里已经假设在构建器阶段中安装了所有必要的Node.js依赖项）
# 由于我们已经将node_modules目录复制到了运行器阶段，因此这里不需要再次安装npm或node_modules中的依赖项
# 但是，我们仍然需要安装Node.js运行时本身（除非drpys项目是一个纯静态资源服务，不需要Node.js运行时）
RUN apk add --no-cache nodejs

# 暴露应用程序端口（根据您的项目需求调整）
EXPOSE 5757

# 指定容器启动时执行的命令
CMD ["node", "index.js"]
