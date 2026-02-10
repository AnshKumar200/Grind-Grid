
type BrickProps = {
    color?: string;
    size?: number;
};

function getHeight(count: number) {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 10) return 3;
    return 4;
}

function Brick({ color = "#22c55e", size = 30 }: BrickProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 22 18"
            className='select-none'
        >
            <defs>
                <pattern
                    id="sideTex"
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                >
                    <image
                        href="/side_build.png"
                        width="9"
                        height="9"
                        style={{ imageRendering: "pixelated" }}
                    />
                </pattern>
            </defs>
            {/* top */}
            <polygon
                points="12,2 22,8 12,14 2,8"
                fill={color}
                style={{ filter: "brightness(1.15)" }}
            />

            {/* left */}
            <polygon
                points="2,8 12,14 12,20 2,14"
                fill='url(#sideTex)'
                style={{ filter: "brightness(0.95)" }}
            />

            {/* right */}
            <polygon
                points="22,8 12,14 12,20 22,14"
                fill={color}
                style={{ filter: "brightness(0.8)" }}
            />
        </svg >
    );
}

export default function Pyramid({ count }) {
    const height = getHeight(count)
    const STEP = 11;
    return (
        <div className="relative w-4 h-13">
            {height === -1 ? (
                <div className="absolute bottom-0">
                    <Brick color="#543b0e" />
                </div>
            ) : (
                Array.from({ length: height }).map((_, i) => (
                    <div
                        className="absolute bottom-0 left-1/2"
                        style={{ transform: `translate(-30%, -${i * STEP}px)` }}
                    >
                        <Brick />
                    </div>
                )))
            }
        </div>
    )
}
