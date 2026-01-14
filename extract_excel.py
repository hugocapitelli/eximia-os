import pandas as pd
import os

# Determine base path relative to this script
base_path = os.getcwd()
file_path = os.path.join(base_path, 'Projetos', 'Hoshin automatizado', 'HOSHIN 2026_exímIA_Ventures v2.xlsx')
output_path = os.path.join(base_path, 'stratos_methodology.md')

try:
    xls = pd.ExcelFile(file_path)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"# Extracted Methodology from {os.path.basename(file_path)}\n\n")
        
        for sheet_name in xls.sheet_names:
            f.write(f"## Sheet: {sheet_name}\n\n")
            try:
                # Read the sheet
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                
                # Cleaning
                df = df.dropna(how='all', axis=0) # Drop empty rows
                df = df.dropna(how='all', axis=1) # Drop empty cols
                df = df.fillna('') # Replace NaNs with empty string
                
                # Convert to markdown
                if not df.empty:
                    markdown_table = df.to_markdown(index=False)
                    f.write(markdown_table)
                    f.write("\n\n")
                else:
                    f.write(f"(Sheet {sheet_name} is empty after cleaning)\n\n")
            except Exception as e:
                f.write(f"Error reading sheet {sheet_name}: {e}\n\n")
    
    print(f"Successfully extracted content to {output_path}")

except Exception as e:
    print(f"Failed to process file: {e}")
