import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            minHeight: "100vh", background: "var(--bg-primary)", textAlign: "center", padding: "40px",
        }}>
            <div style={{ fontSize: "6rem", marginBottom: 16 }}>🚛</div>
            <h1 style={{ fontSize: "5rem", fontWeight: 900, color: "var(--accent)", marginBottom: 8 }}>404</h1>
            <h2 style={{ color: "var(--text-primary)", marginBottom: 8 }}>Route Not Found</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 32, maxWidth: 360 }}>
                The page you are looking for seems to have taken a wrong turn. Let us get you back on track.
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
                🏠 Back to Dashboard
            </button>
        </div>
    );
}
