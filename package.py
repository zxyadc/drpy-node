import os
import datetime

# 要排除的目录列表，可以根据需要自行添加
EXCLUDE_DIRS = ['.git', '.idea','soft','drop_code','jstest','local','logs','对话1.txt']

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
    for exclude_dir in EXCLUDE_DIRS:
        exclude_params.extend(["-xr!", exclude_dir])

    command = (
        f"7z a \"{archive_path}\" ./ -r " + " ".join(f"-xr!{dir}" for dir in EXCLUDE_DIRS)
    )

    try:
        # 执行压缩命令
        os.system(command)
        print(f"压缩完成: {archive_path}")
    except Exception as e:
        print(f"压缩失败: {e}")

if __name__ == "__main__":
    compress_directory()
