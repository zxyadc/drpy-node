import os
import datetime

# 要排除的目录列表
EXCLUDE_DIRS = ['.git', '.idea', 'soft', 'drop_code', 'jstest', 'local', 'logs', '对话1.txt']

# 要排除的文件列表
EXCLUDE_FILES = ['config/env.json', '.env', 'js/玩偶哥哥[盘].js']

def compress_directory():
    # 获取当前目录名
    current_dir = os.path.basename(os.getcwd())

    # 获取当前时间
    current_time = datetime.datetime.now().strftime("%Y%m%d")

    # 生成压缩包文件名
    archive_name = f"{current_dir}-{current_time}.7z"

    # 压缩包输出路径 (脚本所在目录的外面)
    parent_dir = os.path.abspath(os.path.join(os.getcwd(), ".."))
    archive_path = os.path.join(parent_dir, archive_name)

    # 构建 7z 压缩命令
    exclude_params = []

    # 排除目录
    for exclude_dir in EXCLUDE_DIRS:
        exclude_params.append(f"-xr!{exclude_dir}")

    # 排除文件
    for exclude_file in EXCLUDE_FILES:
        # 使用相对路径来确保文件的准确性
        if os.path.exists(exclude_file):
            exclude_params.append(f"-xr!{exclude_file}")
        else:
            print(f"警告: {exclude_file} 不存在!")

    # 构建命令
    command = f"7z a \"{archive_path}\" ./ -r " + " ".join(exclude_params)

    # 打印构建的命令进行调试
    print(f"构建的 7z 命令: {command}")

    try:
        # 执行压缩命令
        os.system(command)
        print(f"压缩完成: {archive_path}")
    except Exception as e:
        print(f"压缩失败: {e}")

if __name__ == "__main__":
    compress_directory()
