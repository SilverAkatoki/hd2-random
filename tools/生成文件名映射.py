import os
import json

def generate_file_mapping(base_dir):
    file_mapping = {}

    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".svg"):  # 只处理 .svg 文件
                file_key = os.path.splitext(file)[0]  # 去掉扩展名作为键
                relative_path = os.path.relpath(os.path.join(root, file), base_dir)  # 计算相对路径
                file_mapping[file_key] = relative_path.replace("\\", "/")  # 替换为统一的路径分隔符

    return file_mapping

def save_mapping_to_json(mapping, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    base_directory = "./stratagems"
    output_json_file = "random-dict.json"
    mapping = generate_file_mapping(base_directory)
    save_mapping_to_json(mapping, output_json_file)

    print(output_json_file)