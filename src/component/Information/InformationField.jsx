import React, {useState, useEffect} from 'react'
import Aside from '../Aside'
import InformationFieldHeader from './InformationFieldHeader'
import InformationFieldBody from './InformationFieldBody'
import { API_ENDPOINTS, axiosInstance, API } from '../APIConfig'
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const InformationField = () => {
    const location = useLocation();
    const [selectedImage, setSelectedImage] = useState("");
    const [informationID, setInformationID] = useState('');
    const [formData, setFormData] = useState({
        i_id: 0,
        i_title: '',
        i_type: 0,
        i_detail: '',
        i_img: 0,
        display: 0,
        active: 1
    });

    useEffect(() => {
        const incomingID = location.state?.informationData?.data?.i_id;
        if (incomingID) {
            localStorage.setItem('informationID', incomingID);
            setInformationID(incomingID);
        } else {
            const savedID = localStorage.getItem('informationID');
            if (savedID) {
                setInformationID(savedID);
            }
        }
    }, [location.state]);

    const fetchInformation = async () => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.getInformation}/${informationID}`);
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
        if (informationID) {
            fetchInformation();
        }
    }, [informationID]);

    const handleSave = async () => {
        const payload = {
            i_title: formData.i_title,
            i_type: parseInt(formData.i_type),
            i_detail: formData.i_detail,
            i_img: formData.i_img || 0,
            display: formData.display,
            active: formData.active
        };

        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (formData.i_id) {
                // Perform update
                await axiosInstance.post(`${API_ENDPOINTS.updateInformation}/${formData.i_id}`, payload);
            } else {
                // Perform create
                await axiosInstance.post(API_ENDPOINTS.createInformation, payload);
            }

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Information saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    fetchInformation();
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
                text: 'Error saving information data.'
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
                            <InformationFieldHeader onSave={handleSave}/>
                            <InformationFieldBody
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

export default InformationField