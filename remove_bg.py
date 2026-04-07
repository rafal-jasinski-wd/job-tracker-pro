try:
    from PIL import Image
    # Load the PNG icon v1
    img = Image.open('c:/Users/rafal/Documents/GitHub/job-tracker-pro/public/logo.png').convert("RGBA")
    datas = img.getdata()
    newData = []
    
    # We want to remove the very dark background. The glassmorphism is bright/neon.
    for item in datas:
        # If the pixel is very dark (close to black background)
        if item[0] < 40 and item[1] < 40 and item[2] < 50:
            # Replace with transparent
            newData.append((item[0], item[1], item[2], 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save('c:/Users/rafal/Documents/GitHub/job-tracker-pro/public/logo.png', "PNG")
    print("Background successfully removed!")
except ImportError:
    print("Pillow not installed. Skipping background removal script.")
    import sys
    sys.exit(0)
