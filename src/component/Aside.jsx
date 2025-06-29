import React, { useState } from 'react';
import logo from '../../logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Aside = () => {
    const menuItems = [
        { icon: "ti ti-file-info", label: "Information", to: '/information' },
        { icon: "ti ti-award", label: "Achievement", to: '/achievement' },
        { icon: "ti ti-brand-telegram", label: "Social", to: '/social' },
        { icon: "ti ti-file-cv", label: "Resume", to: '/resume' },
        { icon: "ti ti-brain", label: "Skill", to: '/skill' },
        { icon: "ti ti-text-scan-2", label: "Text", to: '/text' },
        { icon: "ti ti-folders", label: "Portfolio", to: '/portfolio' },
        { icon: "ti ti-photo", label: "Image", to: '/image' },
        { icon: "ti ti-blockquote", label: "Blog", to: '/blog' },
        { icon: "ti ti-mail", label: "Email", to: '/email' },
    ];

    // const location = useLocation();
    const navigate = useNavigate();

    return (
        <aside id="application-sidebar-brand"
            className="! hs-overlay hs-overlay-open:translate-x-0 -translate-x-full  transform hidden xl:block xl:translate-x-0 xl:end-auto xl:bottom-0 fixed xl:!top-[20px] xl:left-auto top-0 left-0 with-vertical h-screen z-[999] shrink-0  w-[270px] shadow-md xl:rounded-md rounded-none bg-white left-sidebar transition-all duration-300" >
            <div className="p-4 flex gap-4 cursor-pointer">
                <a href="../" className="text-nowrap ">
                    <img
                    src={logo}
                    alt="Logo-Dark"
                    className='size-12'
                    />
                </a>
                <span className='my-auto uppercase'>Portfolio</span>
            </div>
            <div className="scroll-sidebar" data-simplebar="">
                <nav className="w-full flex flex-col sidebar-nav px-4">
                    <ul id="sidebarnav" className="text-gray-600 text-sm">
                        {menuItems.map((item, index) => (
                            <li key={index} className="sidebar-item">
                                <button
                                    onClick={() => {
                                        navigate(item.to);
                                        window.location.reload();
                                    }}
                                    className={`sidebar-link gap-3 py-2.5 my-1 text-base flex items-center relative rounded-md w-full ${
                                        location.pathname.startsWith(item.to) ? 'active text-[#006aaf]' : 'text-gray-500'
                                    }`}
                                    >
                                    <i className={`${item.icon} ps-2 text-2xl`}></i> <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    )
}

export default Aside