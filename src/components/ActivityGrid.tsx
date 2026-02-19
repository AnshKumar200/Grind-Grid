import { useEffect, useRef, useState } from "react";
import type { DataActivity } from "../pages/ActivityPage";
import { SiCodeforces, SiGithub, SiLeetcode } from "react-icons/si";

function getColor(count: number) {
    if (count === 0) return '#ffffff';
    if (count < 3) return '#d8b4fe';
    if (count < 6) return '#c084fc';
    if (count < 10) return '#9333ea';
    return '#6b21a8';
};

function getStrokeColor(count: number): string {
    if (count === 0) return '#b794f4';
    return '#b794f4';
}

interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    data: DataActivity | null;
}

export default function ActivityGrid({ data, externalRef }: { data: (DataActivity | null)[], externalRef?: React.RefObject<HTMLCanvasElement | null> }) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    const canvasRef = externalRef ?? internalRef;
    const [tooltip, setTooltip] = useState<TooltipState>({
        visible: false,
        x: 0,
        y: 0,
        data: null,
    });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const CELL_SIZE = 24;
    const GAP = 4;
    const ROWS = 7;
    const CELL_WITH_GAP = CELL_SIZE + GAP;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')
        if (!ctx) return;

        const cols = Math.ceil(data.length / ROWS);
        const width = cols * CELL_WITH_GAP + GAP;
        const height = ROWS * CELL_WITH_GAP + GAP;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        data.forEach((item, index) => {
            const col = Math.floor(index / ROWS);
            const row = index % ROWS;

            const x = GAP + col * CELL_WITH_GAP;
            const y = GAP + row * CELL_WITH_GAP;

            const isHovered = index === hoveredIndex;
            const count = item?.total ?? 0;
            ctx.fillStyle = getColor(count);
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

            ctx.strokeStyle = getStrokeColor(count);
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

            if (isHovered) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                const offset = 2;
                ctx.strokeRect(x - offset, y - offset, CELL_SIZE + offset * 2, CELL_SIZE + offset * 2);
            }
        })
    }, [data, hoveredIndex]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [data]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / CELL_WITH_GAP);
        const row = Math.floor(y / CELL_WITH_GAP);

        if (col >= 0 && row < ROWS && row >= 0) {
            const index = col * ROWS + row;

            const cellX = GAP + col * CELL_WITH_GAP;
            const cellY = GAP + row * CELL_WITH_GAP;

            if (x >= cellX && x < cellX + CELL_SIZE && y >= cellY && y < cellY + CELL_SIZE && index < data.length) {
                setHoveredIndex(index);
                setTooltip({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY + 25,
                    data: data[index],
                });
                canvas.style.cursor = 'pointer';
                return;
            }
        }

        setHoveredIndex(null);
        setTooltip({ ...tooltip, visible: false });
        canvas.style.cursor = 'default';
    }

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        setTooltip({ ...tooltip, visible: false });
    };

    return (
        <div className="z-1 relative w-full">
            <div ref={scrollRef} className="overflow-x-auto w-full max-w-full flex justify-center">
                <div className="relative inline-block">
                    <canvas
                        ref={canvasRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="border border-purple-300/30 rounded-lg"
                    />

                </div>
            </div>
            {tooltip.visible && tooltip.data && (
                <div className="fixed z-50 bg-[#2a1f45] text-[#f5f3ff] p-2 rounded-md pointer-events-none whitespace-nowrap shadow-lg text-base"
                    style={{
                        left: `${tooltip.x + 20}px`,
                        top: `${tooltip.y - 40}px`,
                    }}
                >
                    <div className="font-semibold">
                        {new Date(tooltip.data.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: '2-digit',
                        })}
                    </div>

                    <div className="flex gap-2">
                        {tooltip.data.platforms.github > 0 && <div className="flex gap-1 items-center ">
                            <SiGithub />: {tooltip.data.platforms.github}
                        </div>}
                        {tooltip.data.platforms.leetcode > 0 && <div className="flex gap-1 items-center ">
                            <SiLeetcode />: {tooltip.data.platforms.leetcode}
                        </div>}
                        {tooltip.data.platforms.codeforces > 0 && <div className="flex gap-1 items-center ">
                            <SiCodeforces />: {tooltip.data.platforms.codeforces}
                        </div>}
                    </div>
                </div>
            )}
        </div>
    )
}
