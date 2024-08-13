import pandas as pd

# Read the first Excel file
df1 = pd.read_excel(r"C:\Users\hp\Downloads\matricule.xlsx")


# Read the second Excel file
df2 = pd.read_excel(r"C:\Users\hp\Downloads\fatima.xlsx")


# Merge the dataframes on 'matricule'
merged_df = pd.merge(df1, df2, on='MATRICULE', how='inner')
# Drop the unwanted column 'somme_x'
merged_df = merged_df.drop(columns=['SOM_x'])

# Rename 'somme_y' to 'somme'
merged_df = merged_df.rename(columns={'SOM_y': 'SOM'})

print("Merged DataFrame:")
print(merged_df.head())

# Save the result to a new Excel file
merged_df.to_excel(r'C:\Users\hp\Downloads\merged.xlsx', index=False)