import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../APIConfig';
import { useNavigate } from 'react-router-dom';

const TextDashboard = () => {
    const [texts, setTexts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchText = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getText);
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

                setTexts(updatedNewsArray);
            } catch (error) {
                console.error('Failed to fetch information:', error);
            }
        };

        fetchText();
    }, []);

    const handleEdit = async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getText}/${id}`);
        const textData = response.data;
        navigate('/text-detail', { state: { textData } });
    };

    const handleDelete = async (id) => {
        const Swal = (await import('sweetalert2')).default;

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            customClass: {
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 !mr-2',
                cancelButton: '!bg-red-600 hover:!bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:!ring-red-400'
            },
            buttonsStyling: false,
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            await axiosInstance.put(`${API_ENDPOINTS.deleteText}/${id}`);
            setTexts(prevItems =>
                prevItems.map(item =>
                    item.t_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            Swal.fire({
                title: 'Deleted!',
                text: 'The text has been deleted.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            setTimeout(() => {
                window.location.reload();
            }, 1600);
        } catch (error) {
            console.error("Error toggling visibility:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete the text.',
                icon: 'error'
            });
        }
    };

    return (
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 !border-b">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Information
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Type
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" class="px-6 py-3 ">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {texts.map((text) => (
                        <tr key={text.t_id} class="bg-white !border-b !border-gray-200 hover:!bg-gray-50">
                            <td class="px-6 py-4 font-semibold text-gray-900 max-w-xl truncate ">
                                {text.t_detail}
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900">
                                { text.t_type === 1 ? "Name" : text.t_type === 2 ? "Role" : text.t_type === 3 ? "Menu" : text.t_type === 4 ? "About" :text.t_type === 5 ? "Map" : "Unknown" }
                            </td>
                            <td class="px-6 py-4">
                                <button type="button" class={`!cursor-default my-auto text-white font-medium !rounded-full !text-[12px] !px-3 !py-1 !text-center ${text.display === 1 ? "!bg-blue-500" : "!bg-red-500"}`}>{text.display === 1 ? "Enable" : "Disable"}</button>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex justify-start items-center gap-2">
                                    <i onClick={() => handleEdit(text.t_id)} className="ti ti-edit text-2xl cursor-pointer hover:text-red-700"></i> |
                                    <i onClick={() => handleDelete(text.t_id)} className="ti ti-trash text-2xl cursor-pointer hover:text-red-700"></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TextDashboard