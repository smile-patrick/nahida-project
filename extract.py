import json

with open(r'C:\Users\Admin\.gemini\antigravity\brain\e01b12ee-9cf1-42ce-8418-9b23298f8a2d\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        if 'initKonamiCode()' in line and 'initCompanionPet()' in line:
            data = json.loads(line)
            if 'tool_calls' in data:
                for chunk in data['tool_calls'][0]['args'].get('ReplacementChunks', []):
                    if 'function initCompanionPet' in chunk.get('ReplacementContent', ''):
                        print(chunk['ReplacementContent'])
                        exit(0)
