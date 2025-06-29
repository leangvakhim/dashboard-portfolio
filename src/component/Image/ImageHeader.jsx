import React, {useState} from 'react'
import Profile from '../Profile'
import Swal from 'sweetalert2';
import { API_BASEURL, API_ENDPOINTS, axiosInstance } from '../APIConfig';

const ImageHeader = ({setImages, setFilteredImages}) => {

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files.length) return;

        const formData = new FormData();
        for (let file of files) {
            formData.append("img[]", file);
        }

        try {

            Swal.fire({
                title: 'Uploading images...',
                allowOutsideClick: false,
                backdrop: true,
                buttonsStyling: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-gray-700',
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4'
                }
            });

            const response = await axiosInstance.post(API_ENDPOINTS.uploadImage, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.data) {
                if (response.data.message === "Images already exist." || response.data.data.message === "Images already exist.") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Duplicate Image',
                        text: 'Some images name already exist and were not uploaded.',
                        timer: 2000,
                        showConfirmButton: false,
                        buttonsStyling: false,
                        customClass: {
                            popup: 'bg-white rounded-lg shadow-lg',
                            title: 'text-lg font-semibold text-yellow-600',
                        }
                    });
                    return;
                }
                const updatedImages = await axiosInstance.get(API_ENDPOINTS.getImages);
                if (updatedImages.data && updatedImages.data.data) {
                    setImages(updatedImages.data.data);
                    setFilteredImages(updatedImages.data.data);
                }
            } else {
                console.error("❌ Upload failed or response malformed:", response.data);
            }
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Uploaded!',
                text: 'Images uploaded successfully.',
                timer: 1500,
                showConfirmButton: false,
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-green-600'
                }
            });
        } catch (error) {
            console.error("🔥 Error uploading images:", error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'An error occurred while uploading images.',
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-red-600'
                }
            });
        }
    };

    return (
        <header class=" bg-white shadow-md rounded-md w-full text-sm py-4 px-6">
            <nav class=" w-ful flex items-center justify-between" aria-label="Global">
                <ul class="icon-nav flex items-center gap-4">
                    <li class="relative xl:hidden">
                        <a class="text-xl  icon-hover cursor-pointer text-heading"
                            id="headerCollapse" data-hs-overlay="#application-sidebar-brand"
                            aria-controls="application-sidebar-brand" aria-label="Toggle navigation" href="javascript:void(0)">
                            <i class="ti ti-menu-2 relative z-1"></i>
                        </a>
                    </li>

                    <li className="relative">
                        <form className="">
                            <label htmlFor="fileUpload" className="btn-outline-primary font-medium text-[15px] w-full cursor-pointer hover:bg-blue-600 hover:text-white">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                id="fileUpload"
                                name="file"
                                className="hidden"
                                multiple
                                onChange={handleImageUpload}
                            />
                        </form>
                    </li>
                </ul>
                <Profile/>
            </nav>
        </header>
    )
}

export default ImageHeader