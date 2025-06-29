import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../APIConfig';
import { useNavigate } from 'react-router-dom';

const PortfolioDashboard = () => {
    const [portfolios, setPortfolios] = useState([]);
    const navigate = useNavigate();

    const fetchImageById = async (id) => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.getImages}/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Failed to fetch image for id ${id}`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchPortolio = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getPortfolio);
                let newsArray = response?.data?.data;

                if (newsArray && !Array.isArray(newsArray)) {
                    newsArray = [newsArray];
                } else if (!newsArray) {
                    newsArray = [];
                }

                const updatedNewsArray = await Promise.all(newsArray.map(async (item) => {
                    const image = await fetchImageById(item.p_img);
                    return {
                        ...item,
                        image: image
                    };
                }));

                setPortfolios(updatedNewsArray);
            } catch (error) {
                console.error('Failed to fetch information:', error);
            }
        };

        fetchPortolio();
    }, []);

    const handleEdit = async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getPortfolio}/${id}`);
        const portfolioData = response.data;
        navigate('/portfolio-detail', { state: { portfolioData } });
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
            await axiosInstance.put(`${API_ENDPOINTS.deletePortfolio}/${id}`);
            setPortfolios(prevItems =>
                prevItems.map(item =>
                    item.p_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            Swal.fire({
                title: 'Deleted!',
                text: 'The portfolio has been deleted.',
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
                text: 'Failed to delete the portfolio.',
                icon: 'error'
            });
        }
    };

    const moveItem = async (index, direction) => {
        const newItems = [...portfolios];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items locally
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update e_order values
        const updatedItems = newItems.map((item, i) => ({
            ...item,
            // p_order: newItems.length - i
            p_order: i + 1
        }));

        setPortfolios(updatedItems);

        try {
            await updateOrderOnServer(updatedItems);
        } catch (error) {
            console.error("Failed to update order on server:", error);
        }
    };

    const updateOrderOnServer = async (items) => {
        const payload = items.map(item => ({
            p_id: item.p_id,
            p_order: item.p_order
        }));

        await axiosInstance.put(`${API_ENDPOINTS.updatePortfolioOrder}`, payload);
    };

    return (
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 !border-b">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Image
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Category
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
                    {portfolios.map((portfolio, index) => (
                        <tr key={portfolio.p_id} class="bg-white !border-b !border-gray-200 hover:!bg-gray-50">
                            <td class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                                <img class="!w-10 !h-10 object-cover bg-gray-100" src={portfolio.image.image_url}/>
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900">
                                {portfolio.p_title}
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900">
                                {portfolio.p_category}
                            </td>
                            <td class="px-6 py-4">
                                <button type="button" class={`!cursor-default my-auto text-white font-medium !rounded-full !text-[12px] !px-3 !py-1 !text-center ${portfolio.display === 1 ? "!bg-blue-500" : "!bg-red-500"}`}>{portfolio.display === 1 ? "Enable" : "Disable"}</button>
                            </td>
                            <td class="!px-0 py-4">
                                <div class="flex justify-start items-center gap-2">
                                    <i onClick={() => handleEdit(portfolio.p_id)} className="ti ti-edit text-2xl cursor-pointer hover:text-red-700"></i> |
                                    <i onClick={() => handleDelete(portfolio.p_id)} className="ti ti-trash text-2xl cursor-pointer hover:text-red-700"></i> |
                                    <i onClick={() => moveItem(index, 'up')} className="ti ti-chevron-up text-2xl cursor-pointer hover:text-red-700"></i> |
                                    <i onClick={() => moveItem(index, 'down')} className="ti ti-chevron-down text-2xl cursor-pointer hover:text-red-700"></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PortfolioDashboard