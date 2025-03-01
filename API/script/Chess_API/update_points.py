from utils import *
from data import *

def update_points(players: list, new_ranking: list) -> list:

    global points_leg, allowed_name_chars

    R = 0
    if len(new_ranking) < 15:
        R = 15 - len(new_ranking)

    matches = []

    # TODO: Maybe find a more efficient algorithm
    for i in range(len(new_ranking)):
        player_found = False
        for j in range(len(players)):
            if match(new_ranking[i], players[j]["name"]):
                if players[j]["name"] in matches:
                    raise Exception("✗ Error: Could not update rankings due to ambiguous names declarations in the new standings")
                matches.append(players[j]["name"])
                player_found = True
                players[j]["presences"] += 1
                if (i+1) in list(points_leg.keys()):
                    players[j]["points"] += points_leg[i+1] - R
                    
        if not player_found:
            add_player = input(f"❅ Player {new_ranking[i]} not found in the rankings. Want to add it? [y/N] ")
            if add_player.lower() == "y":
                new_name = input(f"❅ Insert the name of the new player: ")
                if (i+1) in list(points_leg.keys()):
                    players.append({"name": new_name, "points": points_leg[i+1] - R, "presences": 1})
                else:
                    players.append({"name": new_name, "points": 0, "presences": 1})    
                continue
            while True:
                matched_player = input(f"❅ Insert the name of the player that should match: ").lower()
                for j in range(len(players)):
                    if match(matched_player, players[j]["name"]):
                        if players[j]["name"] in matches:
                            raise Exception("✗ Error: Could not update rankings due to ambiguous names declarations in the new standings")
                        matches.append(players[j]["name"])
                        player_found = True
                        players[j]["presences"] += 1
                        if (i+1) in list(points_leg.keys()):
                            players[j]["points"] += points_leg[i+1] - R
                        break


    players = sorted(players, key=lambda x: (-x["points"], -x["presences"])) # Sort the list by points and then presences

    return players