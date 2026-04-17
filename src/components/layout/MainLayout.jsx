import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const DESKTOP_BREAKPOINT = 1024;

export function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Cerrar sidebar al hacer click fuera (solo desktop)
    useEffect(() => {
        if (!isSidebarOpen) return;
        const handleMouseDown = (e) => {
            if (e.target.closest('[data-sidebar]')) return;
            if (typeof window !== 'undefined' && window.innerWidth < DESKTOP_BREAKPOINT) return;
            setIsSidebarOpen(false);
        };
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [isSidebarOpen]);

    return (
        <div className="flex h-screen bg-brand-secondary/10 font-sans text-brand-neutral overflow-hidden">

            {/* Hover strip on left edge to reveal sidebar when closed (desktop only) */}
            {!isSidebarOpen && (
                <div
                    className="fixed left-0 top-0 bottom-0 w-4 z-[35] hidden lg:block bg-transparent"
                    onMouseEnter={() => setIsSidebarOpen(true)}
                    aria-label="Mostrar menú"
                />
            )}

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <main
                className={`flex-1 flex flex-col overflow-hidden w-full relative transition-[margin-left] duration-300 ease-in-out ${isSidebarOpen ? "lg:ml-60" : "lg:ml-0"}`}
            >
                <Topbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Dynamic Content Area: flex-1 min-h-0 so the outlet gets remaining height and can scroll */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}
