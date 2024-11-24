export const extractDominantColor = async (imageUrl: string): Promise<{ primary: string; secondary: string }> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Find the most vibrant color
    const colors: Array<{ r: number; g: number; b: number; saturation: number }> = [];
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate color saturation
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      
      // Only consider colors with decent brightness
      const brightness = (r + g + b) / 3;
      if (brightness > 30 && brightness < 225) {
        colors.push({ r, g, b, saturation });
      }
    }
    
    // Sort by saturation and get the most saturated color
    colors.sort((a, b) => b.saturation - a.saturation);
    const dominantColor = colors[0] || { r: 110, g: 89, b: 165, saturation: 0.5 }; // Fallback color
    
    return {
      primary: `rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.8)`,
      secondary: `rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.4)`
    };
  } catch (error) {
    console.error('Error extracting dominant color:', error);
    return {
      primary: 'rgba(110, 89, 165, 0.8)',
      secondary: 'rgba(90, 69, 145, 0.4)'
    };
  }
};