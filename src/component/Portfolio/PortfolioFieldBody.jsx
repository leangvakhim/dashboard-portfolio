import React, {useEffect, useState} from 'react'
import MediaLibrary from '../MediaLibrary';
import { API_ENDPOINTS, axiosInstance, API } from '../APIConfig';
import JoditEditor from 'jodit-react';
import 'jodit/es5/jodit.css';

const config = {
    readonly: false,
    height: 400,
    placeholder: 'Start typing...',
};

const PortfolioFieldBody = ({formData, setFormData, selectedImage, setSelectedImage}) => {
    const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false || 0);

    useEffect(() => {
        if (formData.display === 1) {
            setIsEnabled(true);
        } else {
            setIsEnabled(false);
        }
    }, [formData.display]);

    const openMediaLibrary = () => {
        setMediaLibraryOpen(true);
    };

    const handleImageSelect = async (imageUrl, field) => {
        if (field === "image") {

            setSelectedImage(imageUrl ? `${imageUrl}` : "");
            try {
                const response = await axiosInstance.get(`${API_ENDPOINTS.getImages}`);
                const result = response.data;

                if (result.status_code === "success" && Array.isArray(result.data)) {
                    const matchedImage = result.data.find(image => image.image_url === imageUrl);
                    if (matchedImage) {
                        setFormData(prevData => ({
                            ...prevData,
                            p_img: matchedImage.image_id,
                        }));
                    } else {
                        console.warn("Image not found in API response for URL:", imageUrl);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch images:", error);
            }
        }

        setMediaLibraryOpen(false);
    };

    return (
        <div>
            <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-x-0 lg:gap-y-3 gap-y-6">
                <div class="col-span-2">
                    <div class="card ">
                        <div class="card-body !py-2">
                            <div class=" !mb-5 ">
                                <div class="mb-3 ">
                                    <h4 class="text-gray-500 text-lg font-semibold mb-2">Title</h4>
                                    <input
                                        value={formData.p_title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, p_title: e.target.value }))}
                                        class="py-3 w-full px-4 text-gray-500 block border-gray-200 rounded-sm text-md focus:border-blue-600 focus:ring-0 "/>
                                </div>
                                <div class="mb-3 ">
                                    <h4 class="text-gray-500 text-lg font-semibold mb-2">Category</h4>
                                    <input
                                        value={formData.p_category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, p_category: e.target.value }))}
                                        class="py-3 w-full px-4 text-gray-500 block border-gray-200 rounded-sm text-md focus:border-blue-600 focus:ring-0 "/>
                                </div>
                                <div class="mb-6 ">
                                    <h4 class="text-gray-500 text-lg font-semibold mb-2">Details</h4>
                                    <JoditEditor
                                        value={formData.p_detail}
                                        config={config}
                                        onChange={(newContent) => setFormData(prev => ({ ...prev, p_detail: newContent } ))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-6">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-gray-500 text-lg font-semibold mb-4">Image</h4>
                            <div class="flex items-center justify-between gap-12">
                                <div class="flex items-center justify-center w-full">
                                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 !border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        {selectedImage ? (
                                            <div>
                                                <img
                                                    src={selectedImage}
                                                    alt="Selected"
                                                    className="!h-40 !w-40 !object-contain"
                                                />
                                                <div className="flex gap-3 mt-2 justify-center">
                                                    <svg
                                                        onClick={() => openMediaLibrary("image")}
                                                        value={formData.p_img}
                                                        onChange={(e) => setFormData({ ...formData, p_img: e.target.value })}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-8 hover:!text-red-700 !text-gray-600"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                                        />
                                                    </svg>
                                                    <svg
                                                        onClick={() => setSelectedImage("")}
                                                        value={formData.p_img}
                                                        onChange={(e) => setFormData({ ...formData, p_img: e.target.value })}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-8 hover:!text-red-700 !text-gray-600"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => openMediaLibrary("image")}
                                                value={formData.p_img}
                                                onChange={(e) => setFormData({ ...formData, p_img: e.target.value })}
                                                className="flex flex-col items-center justify-center pt-5 pb-6 "
                                            >
                                                <svg
                                                    className="w-8 h-8 mb-4 !text-gray-500"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                                <p className="mb-2 text-sm !text-gray-500">
                                                    <span className="font-semibold">Click to upload image</span>
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                            {isMediaLibraryOpen && (
                                <MediaLibrary
                                    onSelect={(imageUrl) => handleImageSelect(imageUrl, "image")}
                                    onClose={() => setMediaLibraryOpen(false)}
                                />
                            )}
                        </div>
                    </div>

                    <div className='flex justify-end'>
                        <div class=" ">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEnabled(prev => {
                                        const newValue = !prev;
                                        setFormData(prevData => ({ ...prevData, display: newValue ? 1 : 0 }));
                                        return newValue;
                                    });
                                }}
                                className={`text-white ${
                                    isEnabled ? '!bg-blue-700 hover:!bg-blue-800 focus:!ring-blue-300' : '!bg-red-700 hover:!bg-red-800 focus:!ring-red-300'
                                } focus:ring-4 focus:outline-none font-medium !rounded-lg !text-sm !px-3 !py-2.5 text-center inline-flex items-center me-2`}
                            >
                                {isEnabled ? (
                                    <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-check mr-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>
                                    Enable
                                    </>
                                ) : (
                                    <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-xbox-x mr-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z" /><path d="M9 8l6 8" /><path d="M15 8l-6 8" /></svg>
                                    Disable
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioFieldBody