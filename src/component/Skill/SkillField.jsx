import React, {useState, useEffect} from 'react'
import Aside from '../Aside'
import SkillFieldHeader from './SkillFieldHeader'
import SkillFieldBody from './SkillFieldBody'
import { API_ENDPOINTS, axiosInstance, API } from '../APIConfig'
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const SkillField = () => {
    const location = useLocation();
    const [skillID, setSkillID] = useState('');
    const [formData, setFormData] = useState({
        sk_id: 0,
        sk_title: '',
        sk_per: 0,
        display: 0,
        active: 1
    });

    useEffect(() => {
        const incomingID = location.state?.skillData?.data?.sk_id;
        if (incomingID) {
            localStorage.setItem('skillID', incomingID);
            setSkillID(incomingID);
        } else {
            const savedID = localStorage.getItem('skillID');
            if (savedID) {
                setSkillID(savedID);
            }
        }
    }, [location.state]);

    const fetchSkill = async () => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.getSkill}/${skillID}`);
            if (response.data && response.data.data) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch resume by ID:", error);
        }
    };

    useEffect(() => {
        if (skillID) {
            fetchSkill();
        }
    }, [skillID]);

    const handleSave = async () => {
        const payload = {
            sk_title: formData.sk_title,
            sk_per: parseInt(formData.sk_per),
            display: formData.display,
            active: formData.active
        };

        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (formData.sk_id) {
                // Perform update
                await axiosInstance.post(`${API_ENDPOINTS.updateSkill}/${formData.sk_id}`, payload);
            } else {
                // Perform create
                await axiosInstance.post(API_ENDPOINTS.createSkill, payload);
            }

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Skill saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    fetchSkill();
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
                text: 'Error saving skill data.'
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
                            <SkillFieldHeader onSave={handleSave}/>
                            <SkillFieldBody
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

export default SkillField