export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        resolve('rgb(128, 128, 128)'); // Fallback gray if context fails
        return;
      }

      // Draw image to canvas
      ctx.drawImage(img, 0, 0);
      
      try {
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        let r = 0, g = 0, b = 0, count = 0;
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < imageData.length; i += 16) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }
        
        // Calculate average color
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        // Adjust brightness and saturation
        const brightness = (r + g + b) / 3;
        const targetBrightness = 128; // Mid-range brightness
        const brightnessAdjust = targetBrightness / (brightness || 1);
        
        r = Math.min(255, Math.floor(r * brightnessAdjust));
        g = Math.min(255, Math.floor(g * brightnessAdjust));
        b = Math.min(255, Math.floor(b * brightnessAdjust));
        
        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch (error) {
        console.error('Error extracting color:', error);
        resolve('rgb(128, 128, 128)'); // Fallback gray
      }
    };

    img.onerror = () => {
      console.error('Error loading image for color extraction');
      resolve('rgb(128, 128, 128)'); // Fallback gray
    };

    // Handle CORS issues by using a proxy if needed
    if (imageUrl.startsWith('http')) {
      img.src = imageUrl;
    } else {
      img.src = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    }
  });
}