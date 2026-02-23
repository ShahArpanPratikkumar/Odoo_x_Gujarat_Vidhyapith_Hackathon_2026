import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

const ROI_DATA = [
    { month: "Sep", Revenue: 18500, Maintenance: 6200 },
    { month: "Oct", Revenue: 22000, Maintenance: 4800 },
    { month: "Nov", Revenue: 19800, Maintenance: 9500 },
    { month: "Dec", Revenue: 25400, Maintenance: 5200 },
    { month: "Jan", Revenue: 23100, Maintenance: 7800 },
    { month: "Feb", Revenue: 27600, Maintenance: 4200 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const revenue = payload.find(p => p.dataKey === "Revenue")?.value || 0;
        const maint = payload.find(p => p.dataKey === "Maintenance")?.value || 0;
        return (
            <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--r-md)", padding: "10px 14px",
                boxShadow: "var(--shadow-md)",
            }}>
                <p style={{ fontWeight: 600, marginBottom: 6, color: "var(--text-primary)" }}>{label}</p>
                <p style={{ color: "#10b981", fontSize: "0.8rem" }}>Revenue: <strong>₹{revenue.toLocaleString()}</strong></p>
                <p style={{ color: "#ef4444", fontSize: "0.8rem" }}>Maintenance: <strong>₹{maint.toLocaleString()}</strong></p>
                <p style={{ color: revenue - maint >= 0 ? "#10b981" : "#ef4444", fontSize: "0.8rem", marginTop: 4, fontWeight: 700 }}>
                    Net: ₹{(revenue - maint).toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function ROIChart() {
    return (
        <div className="chart-container">
            <h4 style={{ marginBottom: 4 }}>Revenue vs Maintenance Cost</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>Monthly breakdown (₹)</p>
            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={ROI_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-card-hover)', opacity: 0.4 }} />
                    <Legend wrapperStyle={{ fontSize: "0.75rem", color: "var(--text-muted)", paddingTop: 10 }} iconType="rect" />

                    <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Maintenance" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
