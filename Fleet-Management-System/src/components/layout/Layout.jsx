import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";


export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Navbar onMenuClick={() => setSidebarOpen(p => !p)} />
            <div className="app-layout">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </>
    );
}
