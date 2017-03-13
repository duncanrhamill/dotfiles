import sys
import json

i3msg = str(sys.argv[1])

workspaces = json.loads(i3msg)

for ws in workspaces:
    if ws['urgent'] == True:
        print('%{B#B71C1C} \uf10c%{B#1E1E1E}', end="")
    elif ws['focused'] == True:
        print(' \uf111', end="")
    else:
        print(' \uf10c', end="")
        
