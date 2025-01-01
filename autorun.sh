#!/bin/bash

echo "警告：此脚本只适用于Debian系列系统（包含Ubuntu），因为需要使用apt来安装软件。"
echo "警告：此脚本只适用于Debian系列系统（包含Ubuntu），因为需要使用apt来安装软件。"
echo "警告：此脚本只适用于Debian系列系统（包含Ubuntu），因为需要使用apt来安装软件。"
echo "警告：如果是群晖NAS自行安装node套件后同样可以使用脚本进行更新使用！！！"
echo "警告：脚本自动更新需要自行添加任务计划设定运行时间！！！"
# 检查是否为群晖系统
is_syno_system() {
    # 群晖系统通常会有 /etc.defaults/VERSION 文件
    if [ -f /etc.defaults/VERSION ]; then
        return 0
    else
        return 1
    fi
}

# 检查是否为群晖系统
if is_syno_system; then
    echo "检测到群晖系统，跳过apt检查。"
else
    # 检查系统是否支持apt
    if ! command -v apt >/dev/null 2>&1; then
        echo "错误：不支持的系统。"
        exit 1
    fi
fi

# 检查Node.js版本
check_node_version() {
    local node_version=$(node -v)
    if [[ "$node_version" < "v20.0.0" ]]; then
        echo "Node.js版本低于20.0.0，正在安装Node.js v20以上版本..."
        install_node_v20
    else
        echo "Node.js版本符合要求（v20以上），跳过安装。"
    fi
}

# 安装Node.js v20以上版本
install_node_v20() {
    echo "正在安装Node.js v20以上版本..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get update
    sudo apt-get install -y nodejs
    npm install -g cnpm --registry=https://registry.npmmirror.com
    echo "Node.js v20以上版本安装完成。"
}

# 检查NVM是否存在，如果不存在则安装
if command -v nvm >/dev/null 2>&1; then
    echo "NVM已安装，跳过NVM安装。"
else
    echo "NVM未安装，正在安装NVM..."
    curl -o- https://gitee.com/RubyMetric/nvm-cn/raw/main/install.sh | bash
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    echo "NVM安装完成。"
fi

# 安装Yarn和PM2
install_yarn_and_pm2() {
    if command -v yarn >/dev/null 2>&1; then
        echo "Yarn已安装，跳过Yarn安装。"
    else
        echo "Yarn未安装，正在安装Yarn..."
        nvm install-node # 安装最新版本的Node.js，自动选择大于v20的版本
        nvm use default
        npm install -g yarn
        if [ $? -ne 0 ]; then
            echo "Yarn安装失败，请手动安装Yarn后重试。"
            exit 1
        fi
        echo "Yarn安装成功。"
    fi

    if command -v pm2 >/dev/null 2>&1; then
        echo "PM2已安装，跳过PM2安装。"
    else
        echo "PM2未安装，正在安装PM2..."
        npm install -g pm2
        if [ $? -ne 0 ]; then
            echo "PM2安装失败，请手动安装PM2后重试。"
            exit 1
        fi
        echo "PM2安装成功。"
    fi
}

# 执行Node.js版本检查
check_node_version

# 安装Yarn和PM2
install_yarn_and_pm2

# 提示用户输入需要创建的目录，30秒后自动使用当前目录
echo "请输入需要创建的目录路径（30秒内无输入则使用当前目录）:"
read -t 30 dir_path

# 根据用户输入设置目录
if [[ -n $dir_path ]]; then
    mkdir -p "$dir_path" && cd "$dir_path"
    if [ $? -eq 0 ]; then
        echo "目录 '$dir_path' 创建并进入成功。"
        REPO_DIR="$dir_path"
    else
        echo "目录 '$dir_path' 创建失败，使用当前目录。"
        REPO_DIR=$(pwd)
    fi
else
    echo "已超时，使用当前目录：$(pwd)"
    REPO_DIR=$(pwd)
fi

# 远程仓库地址
REMOTE_REPO="https://github.com/hjdhnx/drpy-node.git"

# 代理远程仓库地址
echo "如果拉取不顺利，请在脚本中找到$REMOTE_REPO自行注释修改为kk代理地址"
#REMOTE_REPO="https://kkgithub.com/hjdhnx/drpy-node.git"

# 项目名称
PROJECT_NAME="drpy-node"

# 获取设备IP地址
get_device_ip() {
    # 使用curl获取公网IP地址
    # 这里使用的是ipinfo.io服务，你也可以使用其他服务
    IP=$(curl -s https://ipinfo.io/ip)
    if [ $? -eq 0 ]; then
        echo "设备IP地址：$IP"
        echo "公网IP自行打码"
        return 0
    else
        echo "无法获取设备IP地址。"
        return 1
    fi
}

# 获取设备局域网IP地址
get_local_ip() {
    # 使用ip命令获取局域网IP地址
    local ip=$(ip addr show scope global | grep inet | grep -v inet6 | grep -v '127.0.0.1' | awk '{print $2}' | cut -d/ -f1 | head -n1)
    if [ -n "$ip" ]; then
        echo "$ip"
    else
        echo "无法获取局域网IP地址。"
        exit 1
    fi
}

# 获取局域网IP地址
LOCAL_IP=$(get_local_ip)

# 定义创建env.json文件的函数
create_env_json() {
    local env_json_path="$1/config/env.json"
    
    # 检查env.json文件是否存在
    if [ ! -f "$env_json_path" ]; then
        echo "env.json文件不存在，正在创建..."
        # 创建env.json文件并填充默认内容
        cat > "$env_json_path" <<EOF
{
  "ali_token": "",
  "ali_refresh_token": "",
  "quark_cookie": "",
  "uc_cookie": "",
  "bili_cookie": "",
  "thread": "10"
}
EOF
        if [ $? -eq 0 ]; then
            echo "env.json文件创建成功。"
        else
            echo "env.json文件创建失败。"
            exit 1
        fi
    else
        echo "env.json文件已存在，无需创建。"
    fi
}

# 定义创建.env文件的函数
create_default_env() {
    local env_path="$1/.env"
    local env_development_path="$1/.env.development"
    
    # 检查.env文件是否存在
    if [ ! -f "$env_path" ]; then
        echo ".env文件不存在，正在使用.env.development作为模板创建..."
        # 使用.env.development作为模板创建.env文件
        cp "$env_development_path" "$env_path"
        if [ $? -eq 0 ]; then
            echo ".env文件创建成功。"
        else
            echo ".env文件创建失败。"
            exit 1
        fi
    else
        echo ".env文件已存在，无需创建。"
    fi
}

# IP显示标识
has_displayed_ip=""
# 显示内网和公网访问地址
display_ip_addresses() {
    echo "项目主页访问地址："
    echo "内网访问地址：http://$LOCAL_IP:5757"
    get_device_ip
    if [ $? -eq 0 ]; then
        echo "公网主页地址：http://$IP:5757"
    else
        echo "无法获取公网IP地址。"
    fi
}

# 检查项目drpy-node是否存在
if [ -d "$REPO_DIR/$PROJECT_NAME" ]; then
    echo "项目drpy-node存在，跳过克隆步骤，直接执行更新脚本。"
    cd "$REPO_DIR/$PROJECT_NAME"
else
    echo "项目drpy-node不存在，正在从GitHub克隆项目..."
    git clone $REMOTE_REPO "$REPO_DIR/$PROJECT_NAME"
    if [ $? -eq 0 ]; then
        echo "项目drpy-node克隆成功。"
        cd "$REPO_DIR/$PROJECT_NAME"
        # 克隆后创建env.json和.env文件
        create_env_json "$REPO_DIR/$PROJECT_NAME"
        create_default_env "$REPO_DIR/$PROJECT_NAME"
        echo "正在执行yarn..."
        yarn config set registry https://registry.npmmirror.com/
        yarn
        echo "yarn执行成功，正在启动应用..."
        pm2 start index.js --name drpyS
        pm2 save
        pm2 startup
        echo "尝试设置开机自动启动pm2项目，不一定成功，如果以下提示有命令请自行手动输入以确保正常开机启动"
        if [ -z "$has_displayed_ip" ]; then # 检查是否已经显示过IP地址
        display_ip_addresses
            has_displayed_ip=1 # 设置一个标志，表示已经显示过IP地址
        fi
        exit 1
    else
        echo "项目drpy-node克隆失败，请检查网络连接或仓库地址是否正确。"
        exit 1
    fi
fi

# 定义备份函数
backup_files_and_cookie_auth_code() {
    # 备份前先检查文件是否存在，不存在则自动创建
        create_env_json "$REPO_DIR/$PROJECT_NAME"
        create_default_env "$REPO_DIR/$PROJECT_NAME"
    # 备份env.json文件
    local env_json_backup_file="env.json.backup_$(date +%Y%m%d).json"
    echo "正在备份env.json文件..."
    cp "config/env.json" "./$env_json_backup_file"
    if [ $? -eq 0 ]; then
        echo "env.json文件已备份为 $env_json_backup_file"
    else
        echo "备份env.json文件失败。"
        exit 1
    fi

    # 备份.env文件
    local env_backup_file=".env.backup_$(date +%Y%m%d)"
    echo "正在备份.env文件..."
    cp ".env" "./$env_backup_file"
    if [ $? -eq 0 ]; then
        echo ".env文件已备份为 $env_backup_file"
    else
        echo "备份.env文件失败。"
        exit 1
    fi
}

# 定义恢复函数
restore_env_json_and_cookie_auth_code() {
    # 恢复env.json文件
    local env_json_backup_file="env.json.backup_$(date +%Y%m%d).json"
    if [ -f "./$env_json_backup_file" ]; then
        echo "正在恢复env.json文件..."
        cp "./$env_json_backup_file" "config/env.json"
        if [ $? -eq 0 ]; then
            echo "env.json文件已恢复。"
            rm "./$env_json_backup_file"  # 删除备份文件
        else
            echo "恢复env.json文件失败。"
            exit 1
        fi
    else
        echo "备份文件 $env_json_backup_file 不存在，无法恢复env.json文件。"
        exit 1
    fi

    # 恢复.env文件
    local env_backup_file=".env.backup_$(date +%Y%m%d)"
    if [ -f "./$env_backup_file" ]; then
        echo "正在恢复.env文件..."
        cp "./$env_backup_file" ".env"
        if [ $? -eq 0 ]; then
            echo ".env文件已恢复。"
            rm "./$env_backup_file"  # 删除备份文件
        else
            echo "恢复.env文件失败。"
            exit 1
        fi
    else
        echo "备份文件 $env_backup_file 不存在，无法恢复.env文件。"
        exit 1
    fi
}

# 尝试次数限制，避免无限循环
MAX_ATTEMPTS=5
# 尝试计数器
ATTEMPT_COUNT=0

# 定义git fetch最大尝试次数
MAX_FETCH_ATTEMPTS=5
# 尝试计数器
FETCH_ATTEMPT_COUNT=0

# 函数：执行git pull并检查是否成功
pull_repo() {
    if git pull origin main; then
        echo "Git pull 成功。"
        # 执行yarn
        echo "正在还原备份的文件和入库密码值"
        # Git pull成功后执行pm2 restart drpyS之前，还原配置文件和COOKIE_AUTH_CODE值
        restore_env_json_and_cookie_auth_code
        echo "正在执行yarn..."
        if yarn; then
            echo "yarn执行成功。"
            # yarn成功后执行pm2 restart drpyS
            echo "正在重启drpyS进程..."
            pm2 restart drpyS
            # 启动成功后提示项目主页访问地址
            if [ $? -eq 0 ]; then
                if [ -z "$has_displayed_ip" ]; then # 检查是否已经显示过IP地址
                    display_ip_addresses
                    has_displayed_ip=1 # 设置一个标志，表示已经显示过IP地址
                fi
            else
                echo "yarn执行失败。"
                return 1
            fi
        else
            echo "yarn执行失败。"
            return 1
        fi
        return 0
    else
        echo "Git pull 失败。"
        # 捕获git pull错误信息
        local error_output=$(git pull origin main 2>&1)
        
        # 检查是否有冲突发生
        if echo "$error_output" | grep -q 'Your local changes to the following files would be overwritten by merge:'; then
        echo "检查到冲突，正在强制覆盖本地文件..."
        git fetch --all
        git reset --hard origin/main
        echo "本地文件已被强制覆盖。"
        echo "正在还原备份的文件和入库密码值"
        # Git pull成功后执行pm2 restart drpyS之前，还原配置文件和COOKIE_AUTH_CODE值
        restore_env_json_and_cookie_auth_code
        if yarn; then
            echo "yarn执行成功。"
            pm2 restart drpyS
            if [ $? -eq 0 ]; then
                if [ -z "$has_displayed_ip" ]; then # 检查是否已经显示过IP地址
                    display_ip_addresses
                    has_displayed_ip=1 # 设置一个标志，表示已经显示过IP地址
                fi
            else
                echo "PM2重启失败。"
                return 1
            fi
        else
            echo "yarn执行失败。"
            return 1
        fi
    else
        echo "没有找到冲突文件。"
        echo "$error_output"
        return 1
    fi
fi
}

# 函数：尝试执行git fetch直到成功
fetch_until_success() {
    local max_attempts=$MAX_FETCH_ATTEMPTS
    local attempt_count=0

    while [ $attempt_count -lt $max_attempts ]; do
        if git fetch origin; then
            echo "Git fetch 成功。"
            return 0
        else
            echo "Git fetch 失败，尝试次数：$attempt_count"
            ((attempt_count++))
        fi
        sleep 5 # 等待5秒后重试
    done

    echo "已达到最大尝试次数，停止更新。"
    return 1 # 返回1表示失败，这样调用函数的地方可以据此判断是否需要退出循环
}

# 循环检查并尝试更新仓库
while true; do
    FETCH_ATTEMPT_COUNT=0 # 重置尝试计数器
    ATTEMPT_COUNT=0 # 重置尝试计数器

    # 调用 fetch_until_success 函数，并根据返回值判断是否继续
    if ! fetch_until_success; then
        echo "已达到最大尝试次数，停止更新。"
        exit 1
    fi

    # 如果git fetch成功，检查是否有更新
    if git status | grep -q "Your branch is behind"; then
        echo "检测到有更新，执行备份文件"
        backup_files_and_cookie_auth_code # 调用备份函数
        while [ $ATTEMPT_COUNT -lt $MAX_ATTEMPTS ]; do
            if pull_repo; then
                echo "更新仓库完成"
                # 成功更新后不输出访问地址，直接退出循环
                break
            else
                # 如果git pull失败，增加尝试计数器
                ((ATTEMPT_COUNT++))
                echo "git pull 失败，将在 10 秒后重试（剩余尝试次数：$((MAX_ATTEMPTS - ATTEMPT_COUNT))）。"
                sleep 10
            fi
        done
        if [ $ATTEMPT_COUNT -ge $MAX_ATTEMPTS ]; then
            echo "已达到最大尝试次数，停止更新。"
            exit 1
        fi
    else
        # 如果没有更新，输出访问地址
        if [ -z "$has_displayed_ip" ]; then # 检查是否已经显示过IP地址
        echo "当前仓库已经是最新的，无需更新。"
        display_ip_addresses
            has_displayed_ip=1 # 设置一个标志，表示已经显示过IP地址
        fi
        break # 退出循环
    fi
done