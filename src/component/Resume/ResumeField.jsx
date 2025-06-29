import React, {useState, useEffect} from 'react'
import Aside from '../Aside'
import ResumeFieldHeader from './ResumeFieldHeader'
import ResumeFieldBody from './ResumeFieldBody'
import { API_ENDPOINTS, axiosInstance, API } from '../APIConfig'
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const ResumeField = () => {
    const location = useLocation();
    const [resumeID, setResumeID] = useState('');
    const [formData, setFormData] = useState({
        r_id: 0,
        r_title: '',
        r_type: '',
        r_detail: '',
        r_duration: '',
        display: 0,
        active: 1
    });

    useEffect(() => {
        const incomingID = location.state?.resumeData?.data?.r_id;
        if (incomingID) {
            localStorage.setItem('resumeID', incomingID);
            setResumeID(incomingID);
        } else {
            const savedID = localStorage.getItem('resumeID');
            if (savedID) {
                setResumeID(savedID);
            }
        }
    }, [location.state]);

    const fetchResume = async () => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.getResume}/${resumeID}`);
            if (response.data && response.data.data) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch resume by ID:", error);
        }
    };

    useEffect(() => {
        if (resumeID) {
            fetchResume();
        }
    }, [resumeID]);

    const handleSave = async () => {
        const payload = {
            r_title: formData.r_title,
            r_detail: formData.r_detail,
            r_duration: formData.r_duration,
            r_type: parseInt(formData.r_type),
            display: formData.display,
            active: formData.active
        };

        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (formData.r_id) {
                // Perform update
                await axiosInstance.post(`${API_ENDPOINTS.updateResume}/${formData.r_id}`, payload);
            } else {
                // Perform create
                await axiosInstance.post(API_ENDPOINTS.createResume, payload);
            }

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Resume saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    fetchResume();
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
                text: 'Error saving resume data.'
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
                            <ResumeFieldHeader onSave={handleSave}/>
                            <ResumeFieldBody
                                formData={formData}
                                setFormData={setFormData}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </main>
    )
}

export default ResumeField