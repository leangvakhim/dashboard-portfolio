import React, { useEffect, useState } from 'react'
import Aside from '../Aside'
import AchievementFieldHeader from './AchievementFieldHeader'
import AchievementFieldBody from './AchievementFieldBody'
import { useLocation } from 'react-router-dom'
import { axiosInstance, API_ENDPOINTS, API } from '../APIConfig'
import Swal from 'sweetalert2';

const AchievementField = () => {
    const location = useLocation();
    const [selectedImage, setSelectedImage] = useState("");
    const [achievementID, setAchievementID] = useState('');
    const [formData, setFormData] = useState({
        a_id: 0,
        a_type: 0,
        a_img: 0,
        display: 0,
        active: 1
    });

    useEffect(() => {
        const incomingID = location.state?.achievementData?.data?.a_id;
        if (incomingID) {
            localStorage.setItem('achievementID', incomingID);
            setAchievementID(incomingID);
        } else {
            const savedID = localStorage.getItem('achievementID');
            if (savedID) {
                setAchievementID(savedID);
            }
        }
    }, [location.state]);

    const fetchAchievement = async () => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.getAchievement}/${achievementID}`);
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
        if (achievementID) {
            fetchAchievement();
        }
    }, [achievementID]);

    const handleSave = async () => {
        const payload = {
            a_type: parseInt(formData.a_type),
            a_img: formData.a_img,
            display: formData.display,
            active: formData.active
        };

        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (formData.a_id) {
                // Perform update
                await axiosInstance.post(`${API_ENDPOINTS.updateAchievement}/${formData.a_id}`, payload);
            } else {
                // Perform create
                await axiosInstance.post(API_ENDPOINTS.createAchievement, payload);
            }

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Achievement saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    fetchAchievement();
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
                text: 'Error saving achievement data.'
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
                            <AchievementFieldHeader onSave={handleSave}/>
                            <AchievementFieldBody
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

export default AchievementField