import yaml

CONFIG_DIR = "config.yaml"

def read_yaml():
    with open(CONFIG_DIR, "r") as file:
        config = yaml.safe_load(file)
        return config

# def update_yaml(config_file):
#     with open(CONFIG_DIR, "w") as file:
#         yaml.safe_dump(config_file, file)
#         return True