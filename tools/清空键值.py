import json

def clear_json_values(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        cleared_data = {key: "" for key in data}
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(cleared_data, f, ensure_ascii=False, indent=4)
        
        print(f"已清空 {file_path}")
    except Exception as e:
        print(e)

if __name__ == "__main__":
    json_file_path = "stratagem-name.json"
    clear_json_values(json_file_path)