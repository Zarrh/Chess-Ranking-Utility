#!./bin/python3

import yaml
import os
import shutil
import argparse
from datetime import datetime
from get_ranking import get_ranking
from update_points import update_points
from get_standings import get_standings

now = datetime.now()
id = now.strftime("%Y-%m-%d %H:%M:%S")
script_dir = os.path.dirname(os.path.abspath(__file__))


def read_yaml(file: str) -> object:
    with open(file, 'r') as f:
        data = yaml.safe_load(f)
    return data

def write_yaml(file: str, data: object) -> None:
    with open(file, 'w') as f:
        yaml.dump(data, f, default_flow_style=False)

def create_backup(yaml_file: str, qtf_file: str, id="0") -> None:

    shutil.copyfile(yaml_file, f"{script_dir}/history/ranking_{id}.yaml") # Backup current standings yaml
    shutil.copyfile(qtf_file, f"{script_dir}/history/standings_{id}.qtf") # Backup new standings qtf

    print("❅ Backup created successfully ❅")

def generate_standings(qtf_file: str, id: int, yaml_file=None):

    if yaml_file:
        rankings = read_yaml(yaml_file)
        standings = get_standings(qtf_file, id, players=rankings["players"])
    else:
        standings = get_standings(qtf_file, id)

    write_yaml(f"Standings_{id}.yaml", standings)

    print("❅ Standings generated successfully ❅")

def update_ranking(yaml_file: str, qtf_file: str) -> None: # Modify the global YAML file

    standings = read_yaml(f"{script_dir}/{yaml_file}")
    new_rankings = get_ranking(qtf_file)

    standings["players"] = update_points(standings["players"], new_rankings)

    write_yaml(f"{script_dir}/{yaml_file}", standings)
    os.rename(qtf_file, "✓" + qtf_file)

    print("❅ Standings updated successfully ❅")

def clear_history() -> None:
    path = "./history"

    for root, dirs, files in os.walk(path, topdown=False):
        for file in files:
            os.remove(os.path.join(root, file))
        for dir in dirs:
            os.rmdir(os.path.join(root, dir))

    print("❅ History cleared successfully ❅")

def cleanup() -> None: # Remove used QTF files
    files = [f for f in os.listdir() if os.path.isfile(f)]

    for file in files:
        if file[0] == "✓" and file.split(".")[-1] == "qtf":
            os.remove(file)

def restore_old_version(yaml_file: str, otf_file: str) -> None: # Restore an old version

    shutil.copyfile(yaml_file, "./ranking.yaml")
    shutil.copyfile(otf_file, "./standings.qtf")

    os.remove(yaml_file)
    os.remove(otf_file)

    try:
        v = yaml_file.split("/")[-1].split("_")[-1].split(".")[0]
    except:
        v = "Unknown"

    print(f"❅ Version {v} restored successfully ❅")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Software to update the chess rankings")
    parser.add_argument("-o", "--output", type=str, help="Path to the ranking YAML file")
    parser.add_argument("-i", "--input", type=str, help="Path to the new standings QTF file")
    parser.add_argument("-c", "--cleanup", action="store_true", help="Remove the input QTF files after reading them")
    parser.add_argument("--clear-history", action="store_true", help="Clear the history folder")
    parser.add_argument("--restore", nargs=2, help="Restore an old version of a YAML and of a QTF")
    parser.add_argument("--no-backup", action="store_true", help="Prevent the script from saving a backup")
    parser.add_argument("--generate-standings", type=int, help="Generate the single tournament standings instead of updating the global ranking. Requires the ID of the tournament")
    args = parser.parse_args()
    print("❅ ===================================== ❅")
    print("❅ = ♚ Chess ranking update software ♛ = ❅")
    print("❅ ===================================== ❅")
    if args.restore:
        if len(args.restore) != 2:
            raise Exception("Two files are required to be restored")
        if args.restore[0].split(".")[-1] == "yaml" and args.restore[1].split(".")[-1] == "qtf":
            restore_old_version(args.restore[0], args.restore[1])
            exit()
        if args.restore[1].split(".")[-1] == "yaml" and args.restore[0].split(".")[-1] == "qtf":
            restore_old_version(args.restore[1], args.restore[0])
            exit()
        raise Exception("Bad file names: the two files must be a YAML and a QTF")
    if args.clear_history:
        clear_history()
    if args.generate_standings or args.generate_standings == 0:
        if not args.input:
            raise Exception("Input file is required")
        generate_standings(args.input, args.generate_standings, yaml_file=args.output)
        exit()
    if bool(args.output) ^ bool(args.input):
        raise Exception("Yaml and QTF files are both required")
    if args.output and args.input:
        if not args.no_backup:
            create_backup(args.output, args.input, id=id)
        update_ranking(args.output, args.input)
    if args.cleanup:
        cleanup()
