import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const DESKTOP_BREAKPOINT = 1024;

export function MainLayout() {
    const isSidebarOpen = true;

    return (
        <div className="flex h-screen bg-brand-secondary/10 font-sans text-brand-neutral overflow-hidden">

            <Sidebar
                isSidebarOpen={isSidebarOpen}
            />

            <main
                className="flex-1 flex flex-col overflow-hidden w-full lg:ml-60"
            >
                <Topbar
                    isSidebarOpen={isSidebarOpen}
                />

                {/* Dynamic Content Area: flex-1 min-h-0 so the outlet gets remaining height and can scroll */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}
