
export default function KPIBox({ icon, label, value, sub, trend, trendUp, gradient, accent }) {
    return (
        <div style={{
            background: "rgba(19,22,41,0.9)",
            border: "1px solid rgba(99,102,241,0.18)",
            borderRadius: "16px",
            padding: "22px 22px 18px",
            display: "flex", flexDirection: "column", gap: 12,
            position: "relative", overflow: "hidden",
            backdropFilter: "blur(12px)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            cursor: "default",
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 28px ${accent || "rgba(99,102,241,0.2)"}40`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
        >
            
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 2,
                background: gradient || "linear-gradient(90deg, #6366f1, #8b5cf6)",
            }} />
            
            <div style={{
                position: "absolute", top: -20, right: -20,
                width: 80, height: 80, borderRadius: "50%",
                background: `radial-gradient(circle, ${accent || "#6366f1"}20 0%, transparent 70%)`,
                pointerEvents: "none",
            }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{
                    width: 42, height: 42,
                    background: `${accent || "#6366f1"}18`,
                    border: `1px solid ${accent || "#6366f1"}30`,
                    borderRadius: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.15rem",
                    flexShrink: 0,
                }}>
                    {icon}
                </div>
                {trend && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "3px 8px",
                        background: trendUp ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                        border: `1px solid ${trendUp ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                        borderRadius: "20px",
                        fontSize: "0.72rem", fontWeight: 600,
                        color: trendUp ? "#10b981" : "#ef4444",
                    }}>
                        {trendUp ? "↑" : "↓"} {trend}
                    </div>
                )}
            </div>

            <div>
                <div style={{
                    fontSize: "0.7rem", fontWeight: 500,
                    color: "#64748b", textTransform: "uppercase",
                    letterSpacing: "0.08em", marginBottom: 6,
                }}>{label}</div>
                <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "2.1rem", fontWeight: 800,
                    color: "#f1f5f9", lineHeight: 1,
                    letterSpacing: "-0.02em",
                }}>{value}</div>
                {sub && (
                    <div style={{ fontSize: "0.775rem", color: "#475569", marginTop: 6 }}>{sub}</div>
                )}
            </div>
        </div>
    );
}
