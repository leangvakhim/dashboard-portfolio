import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../APIConfig';
import { useNavigate } from 'react-router-dom';

const BlogDashboard = () => {
    const [blogs, setBlogs] = useState([]);
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
        const fetchBlog = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getBlog);
                let newsArray = response?.data?.data;

                if (newsArray && !Array.isArray(newsArray)) {
                    newsArray = [newsArray];
                } else if (!newsArray) {
                    newsArray = [];
                }

                const updatedNewsArray = await Promise.all(newsArray.map(async (item) => {
                    const image = await fetchImageById(item.b_img);
                    return {
                        ...item,
                        image: image
                    };
                }));

                setBlogs(updatedNewsArray);
            } catch (error) {
                console.error('Failed to fetch blog:', error);
            }
        };

        fetchBlog();
    }, []);

    const handleEdit = async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getBlog}/${id}`);
        const blogData = response.data;
        navigate('/blog-detail', { state: { blogData } });
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
            await axiosInstance.put(`${API_ENDPOINTS.deleteBlog}/${id}`);
            setBlogs(prevItems =>
                prevItems.map(item =>
                    item.b_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            Swal.fire({
                title: 'Deleted!',
                text: 'The blog has been deleted.',
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
                text: 'Failed to delete the blog.',
                icon: 'error'
            });
        }
    };

    const moveItem = async (index, direction) => {
        const newItems = [...blogs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items locally
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update e_order values
        const updatedItems = newItems.map((item, i) => ({
            ...item,
            b_order: i + 1
        }));

        setBlogs(updatedItems);

        try {
            await updateOrderOnServer(updatedItems);
        } catch (error) {
            console.error("Failed to update order on server:", error);
        }
    };

    const updateOrderOnServer = async (items) => {
        const payload = items.map(item => ({
            b_id: item.b_id,
            b_order: item.b_order
        }));

        await axiosInstance.put(`${API_ENDPOINTS.updateBlogOrder}`, payload);
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
                            Date
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
                    {blogs.map((blog, index) => (
                        <tr key={blog.b_id} class="bg-white !border-b !border-gray-200 hover:!bg-gray-50">
                            <td class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                                <img class="!w-10 !h-10 !object-cover bg-gray-100" src={blog.image.image_url}/>
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900">
                                {blog.b_title}
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900">
                                {new Date(blog.b_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td class="px-6 py-4">
                                <button type="button" class={`!cursor-default my-auto text-white font-medium !rounded-full !text-[12px] !px-3 !py-1 !text-center ${blog.display === 1 ? "!bg-blue-500" : "!bg-red-500"}`}>{blog.display === 1 ? "Enable" : "Disable"}</button>
                            </td>
                            <td class="!px-0 py-4">
                                <div class="flex justify-start items-center gap-2">
                                    <i onClick={() => handleEdit(blog.b_id)} className="ti ti-edit text-2xl cursor-pointer hover:text-red-700"></i> |
                                    <i onClick={() => handleDelete(blog.b_id)} className="ti ti-trash text-2xl cursor-pointer hover:text-red-700"></i> |
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

export default BlogDashboard