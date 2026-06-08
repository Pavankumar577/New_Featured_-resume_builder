import { useEffect, useRef } from "react";

export default function HalftoneWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.width = window.innerWidth;
        height = canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);

    const dotSpacing = 32;
    let phase = 0;

    const drawGrid = () => {
      ctx.fillStyle = "rgba(10, 15, 30, 0.25)";
      ctx.fillRect(0, 0, width, height);

      const rows = Math.ceil(height / dotSpacing) + 2;
      const cols = Math.ceil(width / dotSpacing) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * dotSpacing;
          const y = r * dotSpacing;

          // Modulate based on distance from center plus time phase
          const dx = x - width / 2;
          const dy = y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const angle = dist * 0.006 - phase;
          const waveValue = (Math.sin(angle) + Math.cos(angle * 0.5) + 2) / 4; // Range 0 to 1

          const maxRadius = 5.5;
          const radius = waveValue * maxRadius + 0.3;

          // Compute color with dynamic opacity to create three-dimensional depth
          const opacity = Math.max(0.08, waveValue * 0.35);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          
          // Halftone visual color matching our premium deep indigo slate neon UI
          ctx.fillStyle = `rgba(129, 140, 248, ${opacity})`;
          ctx.fill();
        }
      }

      phase += 0.006;
      animationFrameId = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="halftone-wave"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full object-cover -z-10 bg-slate-950 pointer-events-none"
    />
  );
}
