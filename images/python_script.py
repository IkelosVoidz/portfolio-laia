import os

def rename_files(folder_path):
    # List all files in the folder
    
    files = sorted([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))])

    # Loop through files and rename each one
    for index, filename in enumerate(files):
        # Get the file extension
        file_extension = os.path.splitext(filename)[1]
        
        # Create new filename
        new_filename = f"{index}{file_extension}"
        
        # Rename the file
        os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_filename))
    
    print("Files renamed successfully.")

# Use the function, replace 'your_folder_path' with the actual path of your folder
rename_files('C:\\GDDV\\portfolio-laia\\public\\images\\pintura')

