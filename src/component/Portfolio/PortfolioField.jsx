import React, {useState, useEffect} from 'react'
import Aside from '../Aside'
import PortfolioFieldHeader from './PortfolioFieldHeader'
import PortfolioFieldBody from './PortfolioFieldBody'
import { API_ENDPOINTS, axiosInstance, API } from '../APIConfig'
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const PortfolioField = () => {
    const location = useLocation();
    const [selectedImage, setSelectedImage] = useState("");
    const [portfolioID, setPortfolioID] = useState('');
    const [formData, setFormData] = useState({
        p_id: 0,
        p_title: '',
        p_category: '',
        p_detail: '',
        p_img: 0,
        display: 0,
        active: 1
    });

    useEffect(() => {
        const incomingID = location.state?.portfolioData?.data?.p_id;
        if (incomingID) {
            localStorage.setItem('portfolioID', incomingID);
            setPortfolioID(incomingID);
        } else {
            const savedID = localStorage.getItem('portfolioID');
            if (savedID) {
                setPortfolioID(savedID);
            }
        }
    }, [location.state]);

    const fetchPortfolio = async () => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.getPortfolio}/${portfolioID}`);
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
        if (portfolioID) {
            fetchPortfolio();
        }
    }, [portfolioID]);

    const handleSave = async () => {
        const payload = {
            p_title: formData.p_title,
            p_category: formData.p_category,
            p_detail: formData.p_detail,
            p_img: formData.p_img,
            display: formData.display,
            active: formData.active
        };

        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (formData.p_id) {
                // Perform update
                await axiosInstance.post(`${API_ENDPOINTS.updatePortfolio}/${formData.p_id}`, payload);
            } else {
                // Perform create
                await axiosInstance.post(API_ENDPOINTS.createPortfolio, payload);
            }

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Portfolio saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    fetchPortfolio();
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
                text: 'Error saving portfolio data.'
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
                            <PortfolioFieldHeader onSave={handleSave}/>
                            <PortfolioFieldBody
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

export default PortfolioField