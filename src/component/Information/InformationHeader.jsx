import React from 'react'
import Profile from '../Profile'
import { Link } from 'react-router-dom'
import MenuIcon from '../MenuIcon'

const InformationHeader = () => {

    return (
        <header class=" bg-white shadow-md rounded-md w-full text-sm py-4 px-6">
            <nav class=" w-ful flex items-center justify-between" aria-label="Global">
                <ul class="icon-nav flex items-center gap-4">
                    <MenuIcon/>

                    <li class="relative">
                        <div class="">
                            <Link
                                onClick={() => localStorage.removeItem('informationID')}
                                to="/information-detail" class="btn-outline-primary font-medium text-[15px] w-full hover:bg-blue-600 hover:text-white">Add Information</Link>
                        </div>
                    </li>
                </ul>
                <Profile/>
            </nav>
        </header>
    )
}

export default InformationHeader