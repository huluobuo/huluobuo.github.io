import os
import json

def get_mp3_files():
    """获取当前目录下所有MP3文件的名称（不带后缀）"""
    # 获取当前工作目录
    current_dir = os.getcwd()
    
    # 存储MP3文件名的列表
    mp3_files = []
    
    # 遍历当前目录下的所有文件
    for file in os.listdir(current_dir):
        # 检查文件是否以.mp3结尾（不区分大小写）
        if file.lower().endswith('.mp3'):
            # 移除文件后缀并添加到列表
            file_name = os.path.splitext(file)[0]
            mp3_files.append(file_name)
    
    return mp3_files

def save_to_json(file_list, output_file='musiclist.json'):
    """将文件列表保存到JSON文件"""
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            # 确保中文等特殊字符能正确保存
            json.dump(file_list, f, ensure_ascii=False, indent=4)
        print(f"成功保存 {len(file_list)} 个MP3文件信息到 {output_file}")
    except Exception as e:
        print(f"保存文件时出错: {e}")

if __name__ == "__main__":
    mp3_list = get_mp3_files()
    if mp3_list:
        save_to_json(mp3_list)
    else:
        print("当前目录下没有找到MP3文件")
    