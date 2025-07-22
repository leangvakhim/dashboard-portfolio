import React from 'react'

const MenuIcon = () => {
    return (
        <li class="relative xl:hidden">
            <a class="text-xl  icon-hover cursor-pointer text-heading"
                id="headerCollapse" data-hs-overlay="#application-sidebar-brand"
                aria-controls="application-sidebar-brand" aria-label="Toggle navigation" href="javascript:void(0)">
                <i class="ti ti-menu-2 relative z-1"></i>
            </a>
        </li>
    )
}

export default MenuIcon