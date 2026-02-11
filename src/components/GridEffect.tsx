import { useEffect, useRef } from 'react';

export default function GridEffect() {
    const canvasRef = useRef(null);
    const cellStatesRef = useRef({});
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        const width = window.innerWidth;
        const height = window.innerHeight;

        const cellSize = 40;
        const animationDuration = 1500;
        const colorChangeInterval = 1500;

        const cols = Math.ceil(width / cellSize) + 1;
        const rows = Math.ceil(height / cellSize) + 1;

        const colors = ["#2262e3", "#dc2626", "#16a34a", "#ea580c", "#9333ea", "#0891b2"];

        const activateRandomCells = () => {
            const numCells = Math.floor(Math.random() * 10) + 10;

            for (let i = 0; i < numCells; i++) {
                const randomCol = Math.floor(Math.random() * cols);
                const randomRow = Math.floor(Math.random() * rows);
                const key = `${randomCol}-${randomRow}`;

                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                cellStatesRef.current[key] = {
                    startTime: Date.now(),
                    duration: animationDuration,
                    color: randomColor
                };
            }
        };

        const drawSquareGrid = () => {
            ctx.clearRect(0, 0, width, height);

            const now = Date.now();

            for (let col = 0; col < cols; col++) {
                for (let row = 0; row < rows; row++) {
                    const screenX = col * cellSize;
                    const screenY = row * cellSize;
                    const key = `${col}-${row}`;

                    let fillColor = "#ffffff";
                    let strokeColor = "#e5e7eb";
                    let opacity = 1;

                    if (cellStatesRef.current[key]) {
                        const elapsed = now - cellStatesRef.current[key].startTime;
                        const progress = elapsed / cellStatesRef.current[key].duration;

                        if (progress < 1) {
                            const colorProgress = 1 - progress;
                            fillColor = cellStatesRef.current[key].color;
                            opacity = colorProgress;
                        } else {
                            delete cellStatesRef.current[key];
                        }
                    }

                    ctx.fillStyle = fillColor;
                    ctx.globalAlpha = opacity;
                    ctx.fillRect(screenX, screenY, cellSize, cellSize);

                    ctx.strokeStyle = strokeColor;
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(screenX, screenY, cellSize, cellSize);
                }
            }

            ctx.globalAlpha = 1;
        };

        const animate = () => {
            drawSquareGrid();
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        const interval = setInterval(activateRandomCells, colorChangeInterval);
        return () => {
            clearInterval(interval);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-screen h-screen absolute inset-0 pointer-events-none"
            style={{
                top: 0,
                left: 0,
                zIndex: 0
            }}
        />
    );
}
