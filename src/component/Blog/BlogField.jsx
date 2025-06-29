import React, {useState, useEffect} from 'react'
import Aside from '../Aside'
import BlogFieldHeader from './BlogFieldHeader'
import BlogFieldBody from './BlogFieldBody'
import { API_ENDPOINTS, axiosInstance, API } from '../APIConfig'
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const BlogField = () => {
    const location = useLocation();
    const [selectedImage, setSelectedImage] = useState("");
    const [blogID, setBlogID] = useState('');
    const [formData, setFormData] = useState({
        b_id: 0,
        b_title: '',
        b_subtitle: '',
        b_detail: '',
        b_img: 0,
        b_date: "Jun 24, 2025",
        display: 0,
        active: 1
    });

    useEffect(() => {
        const incomingID = location.state?.blogData?.data?.b_id;
        if (incomingID) {
            localStorage.setItem('blogID', incomingID);
            setBlogID(incomingID);
        } else {
            const savedID = localStorage.getItem('blogID');
            if (savedID) {
                setBlogID(savedID);
            }
        }
    }, [location.state]);

    const fetchBlog = async () => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.getBlog}/${blogID}`);
            if (response.data && response.data.data) {
                setFormData(response.data.data);
                if (response.data.data.image?.img) {
                    setSelectedImage(`${API}/storage/uploads/${response.data.data.image.img}`);
                }
            }
        } catch (error) {
            console.error("Failed to fetch news by ID:", error);
        }
    };

    useEffect(() => {
        if (blogID) {
            fetchBlog();
        }
    }, [blogID]);

    const handleSave = async () => {
        const payload = {
            b_title: formData.b_title,
            b_subtitle: formData.b_subtitle,
            b_detail: formData.b_detail,
            b_img: formData.b_img,
            b_date: formData.b_date,
            display: formData.display,
            active: formData.active
        };

        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (formData.b_id) {
                // Perform update
                await axiosInstance.post(`${API_ENDPOINTS.updateBlog}/${formData.b_id}`, payload);
            } else {
                // Perform create
                await axiosInstance.post(API_ENDPOINTS.createBlog, payload);
            }

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Blog saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    fetchBlog();
                    setTimeout(() => {
                        window.location.reload();
                    }, 600);
                }
            });
        } catch (err) {
            Swal.close();
            console.error("Error saving:", err);
            if (err.response?.data?.errors) {
                console.error("Validation failed:", err.response.data.errors);
            }
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Error saving blog data.'
            });
        }
    };

    return (
        <main>
            <div id="main-wrapper" class="flex p-5 xl:pr-0">
                <Aside/>
                <div class=" w-full page-wrapper xl:px-6 px-0">
                    <main class="h-full max-w-full">
                        <div class="container full-container p-0 flex flex-col gap-6">
                            <BlogFieldHeader onSave={handleSave}/>
                            <BlogFieldBody
                                formData={formData}
                                setFormData={setFormData}
                                selectedImage={selectedImage}
                                setSelectedImage={setSelectedImage}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </main>
    )
}

export default BlogField