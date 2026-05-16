const dustCache = new Map();

function drawDust(context, centerX, centerY, scale = 1, blur = 1) {
  const radius = 35 * scale;

  const draw = (ctx, c) => {
    ctx.globalAlpha = 1;
    ctx.filter = `blur(${blur}px)`;
    const getCSSVar = (varName) => getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    ctx.fillStyle = getCSSVar('--dust-color');

    ctx.beginPath();
    ctx.arc(c, c, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const cacheKey = `${scale.toFixed(2)}-${blur.toFixed(1)}`;

  if (!dustCache.has(cacheKey)) {
    const maxRadius = radius + (blur * 2);
    const canvasSize = Math.ceil(maxRadius * 2);
    const localCenter = canvasSize / 2;

    const cacheCanvas = document.createElement('canvas');
    cacheCanvas.width = canvasSize;
    cacheCanvas.height = canvasSize;
    const cacheCtx = cacheCanvas.getContext('2d');
    draw(cacheCtx, localCenter);

    dustCache.set(cacheKey, cacheCanvas);
  }

  const cachedDust = dustCache.get(cacheKey);
  const offset = cachedDust.width / 2;

  context.drawImage(cachedDust, centerX - offset, centerY - offset);
}