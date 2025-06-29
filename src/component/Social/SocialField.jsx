import React, { useEffect, useState } from 'react'
import Aside from '../Aside'
import SocialFieldHeader from './SocialFieldHeader'
import SocialFieldBody from './SocialFieldBody'
import { useLocation } from 'react-router-dom'
import { axiosInstance, API_ENDPOINTS, API } from '../APIConfig'
import Swal from 'sweetalert2';

const SocialField = () => {
    const location = useLocation();
    const [selectedImage, setSelectedImage] = useState("");
    const [socialID, setSocialID] = useState('');
    const [formData, setFormData] = useState({
        s_id: 0,
        s_title: "",
        s_link: "",
        s_img: 0,
        display: 0,
        active: 1
    });

    useEffect(() => {
        const incomingID = location.state?.socialData?.data?.s_id;
        if (incomingID) {
            localStorage.setItem('socialID', incomingID);
            setSocialID(incomingID);
        } else {
            const savedID = localStorage.getItem('socialID');
            if (savedID) {
                setSocialID(savedID);
            }
        }
    }, [location.state]);

    const fetchSocial = async () => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.getSocial}/${socialID}`);
            if (response.data && response.data.data) {
                setFormData(response.data.data);
                if (response.data.data.image?.img) {
                    setSelectedImage(`${API}/storage/uploads/${response.data.data.image.img}`);
                }
            }
        } catch (error) {
            console.error("Failed to fetch social by ID:", error);
        }
    };

    useEffect(() => {
        if (socialID) {
            fetchSocial();
        }
    }, [socialID]);

    const handleSave = async () => {
        const payload = {
            s_title: formData.s_title,
            s_link: formData.s_link,
            s_img: formData.s_img,
            display: formData.display,
            active: formData.active
        };

        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (formData.s_id) {
                // Perform update
                await axiosInstance.post(`${API_ENDPOINTS.updateSocial}/${formData.s_id}`, payload);
            } else {
                // Perform create
                await axiosInstance.post(API_ENDPOINTS.createSocial, payload);
            }

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Social saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    fetchSocial();
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
                text: 'Error saving social data.'
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
                            <SocialFieldHeader onSave={handleSave}/>
                            <SocialFieldBody
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

export default SocialField