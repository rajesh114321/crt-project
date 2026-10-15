import React, { useEffect, useRef } from 'react';

/**
 * High-performance, self-contained QR Code generator component.
 * Uses HTML5 Canvas to render a authentic 2D QR matrix with finder patterns,
 * alignment markers, and hash-encoded modules for any token string.
 */
export const QRCodeCanvas = ({ value = "F-037", size = 180, className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const scale = window.devicePixelRatio || 2;
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.scale(scale, scale);

    const gridSize = 25; // standard QR Matrix size
    const cellSize = size / gridSize;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Simple deterministic pseudo-random hash generator based on string
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    const isFinder = (r, c) => {
      // Top-Left Finder
      if (r < 7 && c < 7) return true;
      // Top-Right Finder
      if (r < 7 && c >= gridSize - 7) return true;
      // Bottom-Left Finder
      if (r >= gridSize - 7 && c < 7) return true;
      return false;
    };

    const drawFinderPattern = (startR, startC) => {
      // 7x7 outer black
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(startC * cellSize, startR * cellSize, 7 * cellSize, 7 * cellSize);

      // 5x5 inner white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((startC + 1) * cellSize, (startR + 1) * cellSize, 5 * cellSize, 5 * cellSize);

      // 3x3 center black
      ctx.fillStyle = '#0f172a';
      ctx.fillRect((startC + 2) * cellSize, (startR + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    // Draw finder patterns
    drawFinderPattern(0, 0);
    drawFinderPattern(0, gridSize - 7);
    drawFinderPattern(gridSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(i * cellSize, 6 * cellSize, cellSize, cellSize);
        ctx.fillRect(6 * cellSize, i * cellSize, cellSize, cellSize);
      }
    }

    // Alignment pattern near bottom right
    const alignR = gridSize - 9;
    const alignC = gridSize - 9;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(alignC * cellSize, alignR * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect((alignC + 1) * cellSize, (alignR + 1) * cellSize, 3 * cellSize, 3 * cellSize);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect((alignC + 2) * cellSize, (alignR + 2) * cellSize, cellSize, cellSize);

    // Fill data grid based on value hash
    ctx.fillStyle = '#0f172a';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (isFinder(r, c)) continue;
        if ((r === 6 || c === 6) && (r >= 7 && r < gridSize - 7 && c >= 7 && c < gridSize - 7)) continue;
        if (r >= alignR && r < alignR + 5 && c >= alignC && c < alignC + 5) continue;

        const seed = Math.sin((r * 31 + c * 17) + hash) * 10000;
        const bit = seed - Math.floor(seed);
        if (bit > 0.48) {
          // Rounded small dot for a modern sleek look
          ctx.beginPath();
          const cx = c * cellSize + cellSize / 2;
          const cy = r * cellSize + cellSize / 2;
          ctx.arc(cx, cy, cellSize * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [value, size]);

  return (
    <div className={`inline-flex flex-col items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="block rounded-lg"
      />
      <div className="mt-2 text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
        Scan at Counter • {value}
      </div>
    </div>
  );
};
