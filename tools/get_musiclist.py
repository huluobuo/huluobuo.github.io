import os
import json


def get_mp3_files():
    """获取musics目录下所有MP3文件的名称（不带后缀）"""
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 音乐文件存储目录（相对于脚本目录向上一级，然后进入musics目录）
    musics_dir = os.path.join(script_dir, '../musics')
    
    # 标准化路径，处理../等相对路径
    musics_dir = os.path.normpath(musics_dir)
    
    # 存储MP3文件名的列表
    mp3_files = []
    
    # 检查musics目录是否存在
    if not os.path.exists(musics_dir):
        print(f"错误：musics目录不存在 - {musics_dir}")
        return mp3_files
    
    # 遍历musics目录下的所有文件
    for file in os.listdir(musics_dir):
        # 检查文件是否以.mp3结尾（不区分大小写）
        if file.lower().endswith('.mp3'):
            # 移除文件后缀并添加到列表
            file_name = os.path.splitext(file)[0]
            mp3_files.append(file_name)
    
    return mp3_files


def save_to_json(file_list, output_file=None):
    """将文件列表保存到JSON文件"""
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 默认输出文件路径（相对于脚本目录向上一级，然后进入api目录）
    if output_file is None:
        output_file = os.path.join(script_dir, '../api/musiclist.json')
        output_file = os.path.normpath(output_file)
    
    try:
        # 确保输出目录存在
        output_dir = os.path.dirname(output_file)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"创建输出目录：{output_dir}")
        
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
        print("musics目录下没有找到MP3文件")
    