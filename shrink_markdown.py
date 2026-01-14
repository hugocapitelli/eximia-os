import re

input_path = r'c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\stratos_methodology.md'
output_path = r'c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\stratos_methodology_lite.md'

with open(input_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Split by "## Sheet:"
sections = content.split('## Sheet:')
new_content = [sections[0]]

for section in sections[1:]:
    lines = section.split('\n')
    # Keep header and first 50 lines of table
    kept_lines = lines[:100] 
    if len(lines) > 100:
        kept_lines.append(f"\n... (Truncated {len(lines)-100} lines) ...\n")
    new_content.append('## Sheet:' + '\n'.join(kept_lines))

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(''.join(new_content))

print(f"Shrunk content to {output_path}")
