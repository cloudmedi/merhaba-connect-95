export const extractDominantColor = async (imageUrl: string): Promise<string> => {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Create an image element
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS

    // Wait for the image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image to canvas
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calculate average color
    let r = 0, g = 0, b = 0;
    let count = 0;

    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    // Calculate averages
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    return `rgb(${r}, ${g}, ${b})`;
  } catch (error) {
    console.error('Error extracting dominant color:', error);
    return 'rgb(110, 89, 165)'; // Fallback color
  }
};