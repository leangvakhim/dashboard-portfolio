import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../APIConfig';
import { Link } from 'react-router-dom';
import Profile from '../Profile';
import Swal from 'sweetalert2';

const EmailDashboard = () => {
    const [emails, setEmails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const totalPages = Math.ceil(emails.length / rowsPerPage);
    const indexOfLastEmail = currentPage * rowsPerPage;
    const indexOfFirstEmail = indexOfLastEmail - rowsPerPage;
    const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getEmail);
                let newsArray = response?.data?.data;

                if (newsArray && !Array.isArray(newsArray)) {
                    newsArray = [newsArray];
                } else if (!newsArray) {
                    newsArray = [];
                }

                const updatedNewsArray = await Promise.all(newsArray.map(async (item) => {
                    // const image = await fetchImageById(item.i_img);
                    return {
                        ...item,
                        // image: image
                    };
                }));

                setEmails(updatedNewsArray);
            } catch (error) {
                console.error('Failed to fetch information:', error);
            }
        };

        fetchEmail();
    }, []);

    const handleDeleteSelected = () => {
        if (selectedEmails.length === 0) return;

        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete selected emails!',
            icon: 'warning',
            showCancelButton: true,
            customClass: {
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 !mr-2',
                cancelButton: '!bg-red-600 hover:!bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:!ring-red-400'
            },
            confirmButtonText: 'Yes, delete them!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.post(API_ENDPOINTS.deleteEmail, { e_id: selectedEmails })
                .then(() => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Selected emails have been deleted.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    setTimeout(() => {
                        setEmails(prev => prev.filter(email => !selectedEmails.includes(email.e_id)));
                        setSelectedEmails([]);
                    }, 1500);
                })
                .catch(error => {
                    console.error('Failed to delete emails:', error);
                    Swal.fire('Error', 'There was an error deleting the emails.', 'error');
                });
            }
        });
    };

    return (
        <div>
            {/* header */}
            <header class=" bg-white shadow-md rounded-md w-full text-sm py-4 px-6">
                <nav class=" w-ful flex items-center justify-between" aria-label="Global">
                    <ul class="icon-nav flex items-center gap-4">
                        <li class="relative xl:hidden">
                            <a class="text-xl  icon-hover cursor-pointer text-heading"
                                id="headerCollapse" data-hs-overlay="#application-sidebar-brand"
                                aria-controls="application-sidebar-brand" aria-label="Toggle navigation" href="javascript:void(0)">
                                <i class="ti ti-menu-2 relative z-1"></i>
                            </a>
                        </li>

                        <li class="relative">
                            <div class="">
                                <button onClick={handleDeleteSelected} class="btn-outline-danger font-medium text-[15px] w-full hover:bg-red-500 hover:text-white">Delete Email</button>
                            </div>
                        </li>
                    </ul>
                    <Profile/>
                </nav>
            </header>
            {/* dashbaord */}
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
                        <select
                            id="rowsPerPage"
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border !rounded  !border-gray-300"
                        >
                            <option value={1}>1</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 !border-b">
                        <tr>
                            <th className="px-6 py-3">
                                <input
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedEmails(currentEmails.map((email) => email.e_id));
                                        } else {
                                            setSelectedEmails([]);
                                        }
                                    }}
                                    checked={currentEmails.length > 0 && selectedEmails.length === currentEmails.length}
                                    type="checkbox" className='!border-gray-300'/>
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3 ">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEmails.map((email) => (
                            <tr key={email.e_id} class="bg-white !border-b !border-gray-200 hover:!bg-gray-50">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        className='!border-gray-300'
                                        checked={selectedEmails.includes(email.e_id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedEmails((prev) => [...prev, email.e_id]);
                                            } else {
                                                setSelectedEmails((prev) => prev.filter((id) => id !== email.e_id));
                                            }
                                        }}
                                    />
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-900">
                                    {email.e_name}
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-900">
                                    {email.e_email}
                                </td>
                                <td
                                    onClick={() => {
                                        setSelectedEmail(email);
                                        setIsModalOpen(true);
                                    }}
                                    class="px-6 py-4">
                                    <div class="flex justify-start items-center gap-2">
                                        <i className="ti ti-mail-opened text-2xl cursor-pointer hover:text-red-700"></i>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                        <div className="flex justify-between items-center !border-b-2 pb-3">
                            <h3 className="text-xl font-semibold">Mail Details</h3>
                            <button
                            onClick={() => setIsModalOpen(false)}
                            className="!text-red-700 hover:!text-red-800">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="py-4 space-y-4">
                            <p className="text-base text-gray-700">
                                <strong>Full Name:</strong> {selectedEmail?.e_name}
                            </p>
                            <p className="text-base text-gray-700">
                                <strong>Email:</strong> {selectedEmail?.e_email}
                            </p>
                            <p className="text-base text-gray-700">
                                <strong>Description:</strong> {selectedEmail?.e_detail}
                            </p>
                        </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mt-4 px-6 py-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        Next
                    </button>
                </div>

            </div>
        </div>

    )
}

export default EmailDashboard