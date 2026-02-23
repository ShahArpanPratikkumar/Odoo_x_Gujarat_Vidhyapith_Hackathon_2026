import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FUEL_DATA = [
    { month: "Sep", "GJ-01-AB": 12.4, "GJ-05-CD": 11.8, "GJ-01-GH": 10.2 },
    { month: "Oct", "GJ-01-AB": 13.1, "GJ-05-CD": 12.2, "GJ-01-GH": 10.8 },
    { month: "Nov", "GJ-01-AB": 12.8, "GJ-05-CD": 11.5, "GJ-01-GH": 11.4 },
    { month: "Dec", "GJ-01-AB": 14.2, "GJ-05-CD": 13.0, "GJ-01-GH": 12.1 },
    { month: "Jan", "GJ-01-AB": 13.6, "GJ-05-CD": 12.7, "GJ-01-GH": 11.9 },
    { month: "Feb", "GJ-01-AB": 14.8, "GJ-05-CD": 13.5, "GJ-01-GH": 12.6 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--r-md)", padding: "10px 14px",
                boxShadow: "var(--shadow-md)",
            }}>
                <p style={{ fontWeight: 600, marginBottom: 6, color: "var(--text-primary)" }}>{label}</p>
                {payload.map(p => (
                    <p key={p.dataKey} style={{ color: p.color, fontSize: "0.8rem" }}>
                        {p.dataKey}: <strong>{p.value} km/L</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function FuelEfficiencyChart() {
    return (
        <div className="chart-container">
            <h4 style={{ marginBottom: 4 }}>Fuel Efficiency Trend</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>Monthly fuel efficiency (km/L) per vehicle</p>
            <ResponsiveContainer width="100%" height={240}>
                <LineChart data={FUEL_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[9, 16]} unit=" km/L" />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
                    <Legend wrapperStyle={{ fontSize: "0.75rem", color: "var(--text-muted)", paddingTop: 10 }} iconType="circle" />

                    <Line type="monotone" dataKey="GJ-01-AB" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="GJ-05-CD" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="GJ-01-GH" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
