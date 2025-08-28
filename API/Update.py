import os
import subprocess
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update the rankings")
    parser.add_argument("-i", "--input", type=str, help="Path to the new standings QTF file")
    parser.add_argument("-n", "--number", type=int, help="Id of the tournament")
    parser.add_argument("-o", "--old", type=str, help="Old Standings file")
    args = parser.parse_args()

    script_path = os.path.abspath("./script/Chess_API/main.py")

    if args.input and args.number != None:
        subprocess.run(["cp", args.input, "./script/Chess_API"])
        if args.old:
            os.remove(args.old)
        subprocess.run(
          [
            "./script/Chess_API/bin/python3", 
            "./script/Chess_API/main.py", 
            "--generate-standings", f"{args.number}",
            "-i", args.input,
            "-o", "ranking.yaml",
          ]
        )
        subprocess.run(
          [
            "./script/Chess_API/bin/python3", 
            "./script/Chess_API/main.py",
            "-i", args.input,
            "-o", "ranking.yaml",
            "-c",
          ]
        )
        subprocess.run(["cp", "./script/Chess_API/ranking.yaml", "./"])
        os.remove(f"./script/Chess_API/{args.input}")
        print("-###- Updated successfully  -###-")
        exit()

    print("-###- Invalid request  -###-") 