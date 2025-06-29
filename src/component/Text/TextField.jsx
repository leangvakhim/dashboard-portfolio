import React, {useState, useEffect} from 'react'
import Aside from '../Aside'
import TextFieldHeader from './TextFieldHeader'
import TextFieldBody from './TextFieldBody'
import { API_ENDPOINTS, axiosInstance, API } from '../APIConfig'
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const TextField = () => {
    const location = useLocation();
    const [textID, setTextID] = useState('');
    const [formData, setFormData] = useState({
        t_id: 0,
        t_detail: '',
        t_type: 0,
        display: 0,
        active: 1
    });

    useEffect(() => {
        const incomingID = location.state?.textData?.data?.t_id;
        if (incomingID) {
            localStorage.setItem('textID', incomingID);
            setTextID(incomingID);
        } else {
            const savedID = localStorage.getItem('textID');
            if (savedID) {
                setTextID(savedID);
            }
        }
    }, [location.state]);

    const fetchText = async () => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.getText}/${textID}`);
            if (response.data && response.data.data) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch resume by ID:", error);
        }
    };

    useEffect(() => {
        if (textID) {
            fetchText();
        }
    }, [textID]);

    const handleSave = async () => {
        const payload = {
            t_detail: formData.t_detail,
            t_type: parseInt(formData.t_type),
            display: formData.display,
            active: formData.active
        };

        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (formData.t_id) {
                // Perform update
                await axiosInstance.post(`${API_ENDPOINTS.updateText}/${formData.t_id}`, payload);
            } else {
                // Perform create
                await axiosInstance.post(API_ENDPOINTS.createText, payload);
            }

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Text saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    fetchText();
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
                            <TextFieldHeader onSave={handleSave}/>
                            <TextFieldBody
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

export default TextField