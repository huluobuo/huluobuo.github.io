import os
import json
import datetime


def get_files_info():
    """获取files目录下所有文件的详细信息"""
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 文件存储目录（相对于脚本目录向上一级，然后进入files目录）
    files_dir = os.path.join(script_dir, '../files')
    
    # 标准化路径，处理../等相对路径
    files_dir = os.path.normpath(files_dir)
    
    # 存储文件信息的列表
    files_info = []
    
    # 检查files目录是否存在
    if not os.path.exists(files_dir):
        print(f"错误：files目录不存在 - {files_dir}")
        return files_info
    
    # 遍历files目录下的所有文件
    for file in os.listdir(files_dir):
        # 获取文件的完整路径
        file_path = os.path.join(files_dir, file)
        
        # 跳过目录，只处理文件
        if os.path.isfile(file_path):
            # 获取文件大小（字节）
            file_size = os.path.getsize(file_path)
            
            # 获取文件最后修改时间
            last_modified = os.path.getmtime(file_path)
            
            # 格式化文件大小
            def format_size(size):
                """将字节大小格式化为人类可读的格式"""
                for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
                    if size < 1024.0:
                        return f"{size:.2f} {unit}"
                    size /= 1024.0
                return f"{size:.2f} PB"
            
            # 格式化文件日期
            formatted_date = datetime.datetime.fromtimestamp(last_modified).strftime('%Y-%m-%d %H:%M:%S')
            
            # 创建文件信息字典
            file_info = {
                "name": file,
                "path": f"./files/{file}",
                "size": format_size(file_size),
                "date": formatted_date
            }
            
            # 添加到列表
            files_info.append(file_info)
    
    return files_info


def save_to_json(file_info_list, output_file=None):
    """将文件信息列表保存到JSON文件"""
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 默认输出文件路径（相对于脚本目录向上一级，然后进入api目录）
    if output_file is None:
        output_file = os.path.join(script_dir, '../api/filelist.json')
        output_file = os.path.normpath(output_file)
    
    try:
        # 确保输出目录存在
        output_dir = os.path.dirname(output_file)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"创建输出目录：{output_dir}")
        
        with open(output_file, 'w', encoding='utf-8') as f:
            # 确保中文等特殊字符能正确保存
            json.dump(file_info_list, f, ensure_ascii=False, indent=4)
        print(f"成功保存 {len(file_info_list)} 个文件信息到 {output_file}")
    except Exception as e:
        print(f"保存文件时出错: {e}")


if __name__ == "__main__":
    files_info = get_files_info()
    if files_info:
        save_to_json(files_info)
    else:
        print("files目录下没有找到文件")
        # 创建空的JSON文件，避免页面加载出错
       