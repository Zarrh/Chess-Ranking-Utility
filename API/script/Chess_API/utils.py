import re

###
# Function to determine whether two players' names do match or not
###
def match(str1: str, str2: str) -> bool:

    str1 = str1.strip().lower()
    str2 = str2.strip().lower()

    arr1 = str1.split(" ")
    arr2 = str2.split(" ")

    # TODO: Compact
    if len(arr1) > len(arr2):
        for i in arr2:
            if i not in arr1:
                return False
            
    if len(arr2) > len(arr1):
        for i in arr1:
            if i not in arr2:
                return False

    if len(arr1) == len(arr2):       
        for i in arr1:
            if i not in arr2:
                return False
        
    return True

###
# Function to remove the first lines of a QTF raw list
###
def remove_first_qtf_lines(raw: list) -> str:

    for i in range(len(raw)): # Remove the first lines
        if raw[i][0:2] == "::":
            raw = raw[i-1:]
            break

    return raw

###
# Function to remove the last lines of a QTF raw list
###
def remove_last_qtf_lines(raw: list) -> str:

    for i in range(1, len(raw)): # Remove the last lines
        if raw[-i][0:2] == "::":
            raw = raw[:-i+2]
            break

    return raw

###
# Function to extract the values of the cells of a QTF list
###
def extract_cell_values_qtf(raw: list) -> list:

    values = [] # Values of the cells

    for i in raw:
        item = " ".join(i.replace("[", "").replace("]", "").strip().split(" ")[2:]).strip() # Extract the cell's value
        if re.match(r"[a-z][0-9];.+[0-9]+", item): # Empty cells
            item = None

        values.append(item)

    return values