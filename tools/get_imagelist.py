import os
import json


def get_image_files():
    """获取images目录下所有图片文件的名称"""
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 图片文件存储目录（相对于脚本目录向上一级，然后进入images目录）
    images_dir = os.path.join(script_dir, '../images')
    
    # 标准化路径，处理../等相对路径
    images_dir = os.path.normpath(images_dir)
    
    # 存储图片文件名的列表
    image_files = []
    
    # 检查images目录是否存在
    if not os.path.exists(images_dir):
        print(f"错误：images目录不存在 - {images_dir}")
        return image_files
    
    # 允许的图片文件扩展名
    allowed_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg')
    
    # 遍历images目录下的所有文件
    for file in os.listdir(images_dir):
        # 检查文件是否为图片文件（不区分大小写）
        if file.lower().endswith(allowed_extensions):
            # 添加文件名到列表
            image_files.append(file)
    
    return image_files


def save_to_json(file_list, output_file=None):
    """将文件列表保存到JSON文件"""
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 默认输出文件路径（相对于脚本目录向上一级，然后进入api目录）
    if output_file is None:
        output_file = os.path.join(script_dir, '../api/imagelist.json')
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
        print(f"成功保存 {len(file_list)} 个图片文件信息到 {output_file}")
    except Exception as e:
        print(f"保存文件时出错: {e}")


if __name__ == "__main__":
    image_list = get_image_files()
    if image_list:
        save_to_json(image_list)
    else:
        print("images目录下没有找到图片文件")
        # 创建空的JSON文件，避免页面加载出错
        save_to_json([])
