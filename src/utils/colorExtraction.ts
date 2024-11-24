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

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calculate colors from different regions
    const topColors = getRegionColors(data, canvas.width, 0, canvas.height / 3);
    const middleColors = getRegionColors(data, canvas.width, canvas.height / 3, 2 * canvas.height / 3);
    const bottomColors = getRegionColors(data, canvas.width, 2 * canvas.height / 3, canvas.height);

    // Select primary and secondary colors based on contrast and brightness
    const primary = adjustColorBrightness(selectDominantColor([...topColors, ...middleColors]));
    const secondary = adjustColorBrightness(selectDominantColor(bottomColors), 0.7);

    return { primary, secondary };
  } catch (error) {
    console.error('Error extracting dominant color:', error);
    return {
      primary: 'rgba(110, 89, 165, 0.8)',
      secondary: 'rgba(90, 69, 145, 0.4)'
    };
  }
};

function getRegionColors(data: Uint8ClampedArray, width: number, startY: number, endY: number) {
  const colors: Array<{ r: number; g: number; b: number; count: number }> = [];
  
  for (let y = startY; y < endY; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Skip very light or very dark colors
      if ((r + g + b) / 3 < 20 || (r + g + b) / 3 > 235) continue;
      
      const color = colors.find(c => 
        Math.abs(c.r - r) < 20 && 
        Math.abs(c.g - g) < 20 && 
        Math.abs(c.b - b) < 20
      );
      
      if (color) {
        color.count++;
      } else {
        colors.push({ r, g, b, count: 1 });
      }
    }
  }
  
  return colors;
}

function selectDominantColor(colors: Array<{ r: number; g: number; b: number; count: number }>) {
  const sorted = colors.sort((a, b) => b.count - a.count);
  const dominant = sorted[0];
  return dominant ? `rgba(${dominant.r}, ${dominant.g}, ${dominant.b}, 0.8)` : 'rgba(110, 89, 165, 0.8)';
}

function adjustColorBrightness(color: string, factor = 1) {
  const matches = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!matches) return color;
  
  const [, r, g, b, a] = matches;
  const brightness = (parseInt(r) + parseInt(g) + parseInt(b)) / 3;
  
  if (brightness < 128) {
    // Lighten dark colors
    return `rgba(${Math.min(255, parseInt(r) * 1.2)}, ${Math.min(255, parseInt(g) * 1.2)}, ${Math.min(255, parseInt(b) * 1.2)}, ${a || factor})`;
  } else {
    // Darken light colors
    return `rgba(${parseInt(r) * 0.8}, ${parseInt(g) * 0.8}, ${parseInt(b) * 0.8}, ${a || factor})`;
  }
}