import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div>
            <div>Grind Grid</div>
            <Link to='activity'>Get your heatmap!</Link>
        </div>
    )
}
