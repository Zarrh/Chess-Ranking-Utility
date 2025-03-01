import re
from utils import *

def get_ranking(file: str, ncols=9, aim_field="NAME") -> list:

    ranking = []

    aim_field = aim_field.lower()
    aim_index = None

    raw = ""

    with open(file, "rb") as f: # Read file content
        raw = f.read().decode()

    raw = raw.split("\n")

    raw = remove_first_qtf_lines(raw)
    raw = remove_last_qtf_lines(raw)

    values = extract_cell_values_qtf(raw)

    for i in range(ncols):
        if values[i].lower() == aim_field:
            aim_index = i

    if aim_index == None:
        return None

    values = values[ncols:] # Remove the headers

    for i in range(len(values)):
        if i % ncols == aim_index:
            ranking.append(values[i])

    return ranking