import re
from utils import *
from data import *

def get_standings(file: str, id:int, players=None, ncols=9) -> dict:

    global points_leg

    data = {"id": id, "date": "", "players": []}

    raw = ""

    with open(file, "rb") as f: # Read file content
        raw = f.read().decode()

    try:
        data["date"] = re.search(r"\([0-9]{2}/[0-9]{2}/[0-9]+,\ +[0-9]{2}/[0-9]{2}/[0-9]+\)", raw).group(0).split(",")[0].replace("(", "")
    except:
        data["date"] = "xx/xx/xxxx"

    raw = raw.split("\n")

    raw = remove_first_qtf_lines(raw)
    raw = remove_last_qtf_lines(raw)

    values = extract_cell_values_qtf(raw)

    name_index = pts_index = None

    for i in range(ncols):
        if values[i].lower() == "name":
            name_index = i
        if values[i].lower() == "pts":
            pts_index = i

    if name_index == None or pts_index == None:
        return None
    
    values = values[ncols:] # Remove the headers

    current_name = current_pts = None

    for i in range(len(values)):
        if i % ncols == name_index:
            current_name = values[i]
            if players:
                player_found = False
                for j in range(len(players)):
                    if match(current_name, players[j]["name"]):
                        player_found = True
                        current_name = players[j]["name"]
                if not player_found:
                    print(f"❅ Player {current_name} not found in the rankings.")
                    current_name = input(f"❅ Insert the name of the new player: ")
                    continue
        if i % ncols == pts_index:
            current_pts = values[i]
        if i % ncols == 0 and i != 0 or i == len(values)-1:
            data["players"].append({"name": current_name, "pts": float(current_pts)})

    R = 0
    if len(data["players"]) < 15:
        R = 15 - len(data["players"])

    for i in range(len(data["players"])):
        if (i+1) in list(points_leg.keys()):
            data["players"][i]["ptsGP"] = points_leg[i+1] - R
        else:
            data["players"][i]["ptsGP"] = 0
    return data