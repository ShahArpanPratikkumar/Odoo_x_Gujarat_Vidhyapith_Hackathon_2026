import Layout from "../components/layout/Layout";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";

const C = "#4f46e5";

const Icons = {
    Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    Phone: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    Mail: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    License: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
};

function StatusBadge({ s }) {
    const is = s === "Active" || s === "On Trip";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99,
            background: is ? "var(--success-bg)" : "var(--danger-bg)", border: `1px solid ${is ? "var(--success)" : "var(--danger)"}30`,
            color: is ? "var(--success)" : "var(--danger)", fontSize: "0.68rem", fontWeight: 700
        }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
            {s}
        </span>
    );
}

function StarRating({ r }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= r ? "#fbbf24" : "var(--border)"} stroke={i <= r ? "#fbbf24" : "var(--border)"}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}

function MetaRow({ icon: Icon, text }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: "0.78rem", marginBottom: 6 }}>
            <span style={{ color: "var(--text-muted)", display: "flex" }}><Icon /></span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
        </div>
    );
}

export default function Drivers() {
    const { drivers, searchQuery, setSearchQuery } = useFleet();
    const [filter, setFilter] = useState("All");

    const filtered = drivers.filter(d => {
        const queryMatch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.license.toLowerCase().includes(searchQuery.toLowerCase());
        const filterMatch = filter === "All" || d.status === filter;
        return queryMatch && filterMatch;
    });

    return (
        <Layout>
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 className="page-title" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Drivers</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>Manage personnel and certifications</p>
                </div>
                <button className="btn btn-primary" style={{ background: C, color: "#fff", padding: "10px 20px", borderRadius: 10, border: "none", fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 12px ${C}30` }}>
                    + Register Driver
                </button>
            </div>

            <div className="toolbar" style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, maxWidth: 400 }} className="search-bar">
                    <div style={{ position: "relative", width: "100%" }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex" }}><Icons.Search /></span>
                        <input
                            placeholder="Search by name or license..."
                            style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none", fontFamily: "inherit" }}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-tabs" style={{ display: "flex", gap: 6, background: "var(--bg-secondary)", padding: 4, borderRadius: 12, border: "1px solid var(--border)" }}>
                    {["All", "Active", "On Trip", "Inactive"].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className="filter-tab"
                            style={{
                                padding: "7px 14px", borderRadius: 8, border: "none", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                                background: filter === t ? "var(--bg-card)" : "transparent",
                                color: filter === t ? C : "var(--text-muted)",
                                boxShadow: filter === t ? "var(--shadow-sm)" : "none",
                                transition: "all .15s"
                            }}
                        >{t}</button>
                    ))}
                </div>
            </div>

            <div className="driver-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {filtered.map(d => (
                    <div key={d.id} className="card" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", transition: "transform .2s, box-shadow .2s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: C, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "1rem" }}>
                                    {d.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>{d.name}</div>
                                    <StarRating r={d.rating} />
                                </div>
                            </div>
                            <StatusBadge s={d.status} />
                        </div>

                        <div style={{ padding: "12px 14px", background: "var(--bg-secondary)", borderRadius: 10, marginBottom: 16 }}>
                            <MetaRow icon={Icons.License} text={d.license} />
                            <MetaRow icon={Icons.Phone} text={d.phone} />
                            <MetaRow icon={Icons.Mail} text={d.email} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div style={{ padding: "8px 10px", background: "var(--accent-glow)", borderRadius: 8, border: "1px solid var(--accent)20" }}>
                                <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Trips Done</div>
                                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>{d.tripsDone}</div>
                            </div>
                            <div style={{ padding: "8px 10px", background: "var(--bg-secondary)", borderRadius: 8, border: "1px solid var(--border)" }}>
                                <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Experience</div>
                                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>{d.experience} yr</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
