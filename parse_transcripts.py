import argparse
import json
import os
import re

TRANSCRIPT_DIR = "transcripts/out"

regex_strings = {
    "line": "\s*(.*):\s*((?:\S+\s)*(?:\S+))\s*",
    "stage_direction": "<(.*)>",
}

char_mappings = {
    "‘": "'",
    "’": "'",
    "”": '"',
    "“": '"',
    "…": "...",
}

def map_characters(string):
    for character, replacement in char_mappings.items():
        string = string.replace(character, replacement)
    return string

def parse_stage_direction(line):
    return {
        "type": "stage_direction",
        "stage_direction": match.groups()[0]
    }

def parse_line(line):
    match = re.match(regex_strings["line"], line)
    return {
        "type": "line",
        "person": match.groups()[0],
        "line": match.groups()[1]
    }

def line_to_object(line):
    line = map_characters(line)
    try:
        if re.match(regex_strings["stage_direction"],line):
            return parse_stage_direction(line)
        elif re.match(regex_strings["line"], line):
            return parse_line(line)
        else:
            print("couldn't make anything of this line: {}".format(line))

    except Exception as e:
        print("Unable to parse line: {}".format(line))

def create_file(name, transcript):
    with open("{}/{}.json".format(TRANSCRIPT_DIR, name), "w") as outfile:
        json.dump(transcript, outfile)

def create_transcript(name, f):
    transcript = {}
    transcript["transcript"] = []
    transcript["name"] = name
    for line in f:
        print(line)
        line = line.strip()
        match = re.match("\*\*(.*)\*\*", line)
        if match:
            create_file(name, transcript)
            # name of the next episode
            next_name = match.groups()[0]
            return next_name
        line_obj = line_to_object(line)
        transcript["transcript"].append(line_obj)
    create_file(name, transcript)
    return None
    

def generate_transcripts(filename):
    with open(filename, "r", encoding='utf-8-sig') as f:
        firstline = f.readline().strip()
        name = ""
        try:
            # import pdb; pdb.set_trace()
            match = re.match("\*\*(.*)\*\*", firstline)
            #import pdb; pdb.set_trace()
            name = match.groups()[0]
            while(name):
                print("generating transcript for {}".format(name))
                name = create_transcript(name, f)
        except Exception as e:
            print("{} did not match the expected format: **<episode_name>**".format(filename))
            print(e)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='transcript parser')
    parser.add_argument('filename')
    args = parser.parse_args()
    filename = args.filename
    generate_transcripts(filename)
