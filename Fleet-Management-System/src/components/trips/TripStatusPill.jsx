const STATUS_CONFIG = {
    "Completed": { bg: "var(--success-bg)", color: "var(--success)", icon: "✅" },
    "In Progress": { bg: "var(--accent-glow)", color: "var(--accent-light)", icon: "🔄" },
    "Scheduled": { bg: "var(--info-bg)", color: "var(--info)", icon: "📅" },
    "Cancelled": { bg: "var(--danger-bg)", color: "var(--danger)", icon: "❌" },
};

export default function TripStatusPill({ status }) {
    const cfg = STATUS_CONFIG[status] || { bg: "rgba(0,0,0,0.1)", color: "var(--text-muted)", icon: "?" };
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px", borderRadius: "var(--r-full)",
            background: cfg.bg, color: cfg.color,
            fontSize: "0.75rem", fontWeight: 600,
        }}>
            <span>{cfg.icon}</span> {status}
        </span>
    );
}
