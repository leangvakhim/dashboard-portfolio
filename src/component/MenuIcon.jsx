import React from 'react';

const MenuIcon = () => {
    const handleToggleSidebar = () => {
        const sidebar = document.querySelector('#application-sidebar-brand');
        if (window.HSOverlay && sidebar) {
            window.HSOverlay.open(sidebar);
        }
    };

    return (
        <li className="relative xl:hidden">
            <button
                onClick={handleToggleSidebar}
                className="text-xl icon-hover cursor-pointer text-heading"
                id="headerCollapse"
                aria-controls="application-sidebar-brand"
                aria-label="Toggle navigation"
            >
                <i className="ti ti-menu-2 relative z-1"></i>
            </button>
        </li>
    );
};

export default MenuIcon;