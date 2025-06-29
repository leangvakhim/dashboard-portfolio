import React, {useState, useEffect} from 'react'
// import images from "../../assets/image/user.jpg";
import { axiosInstance, API_ENDPOINTS } from '../APIConfig';
import Swal from 'sweetalert2';

const ImageBody = ({filteredImages, images, setImages, setFilteredImages}) => {

    const [selectedImageName, setSelectedImageName] = useState("");

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getImages);
                if (response.data && response.data.data) {
                    setImages(response.data.data); // images
                    setFilteredImages(response.data.data);
                } else {
                    setImages([]);
                    setFilteredImages([]); // Reset filtered images
                }
            } catch (error) {
                console.error("Error fetching images:", error);
                setImages([]);
                setFilteredImages([]); // Reset filtered images
            }
        };

        fetchImages();
    }, []);

    // Search functionality
    const handleSearch = (query) => {
        if (!query) {
            setFilteredImages(images);
        } else {
            const filtered = images.filter(image =>
                image.img.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredImages(filtered);
        }
    };

    const handleDeleteImage = async (imageId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this image?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded !ml-2',
                cancelButton: '!bg-red-600 hover:!bg-red-700 text-white py-2 px-4 rounded',
            }
        });

        if (!result.isConfirmed) return;

        try {
            const response = await axiosInstance.delete(`${API_ENDPOINTS.deleteImage}/${imageId}`);
            if (response.status === 200) {
                setImages(images.filter(image => image.image_id !== imageId));
                setFilteredImages(filteredImages.filter(image => image.image_id !== imageId));
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The image has been deleted.',
                    timer: 1500,
                    showConfirmButton: true,
                });
            } else {
                console.error("Failed to delete image:", response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete the image.'
                });
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting the image.'
            });
        }
    };

    return (
        <div class="card ">
            <div class="card-body !py-6">
                {/* search field */}
                <div className="flex items-start justify-start gap-4">
                    <div className="relative max-w-sm ">
                        <input
                            className="text-md w-60 !py-3 px-4 btn-outline-primary !text-start cursor-text !rounded-md !text-gray-900 "
                            type="search"
                            placeholder="Search images"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>
                {/* all images */}
                <div>
                    {filteredImages.length === 0 ? (
                        <p className="text-gray-500 text-center">No images uploaded.</p>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredImages.map((image) => (
                                <div
                                    key={image.image_id}
                                    className="mt-4 relative flex items-center justify-center border rounded-lg"
                                >
                                    <img
                                        src={image.image_url}
                                        alt={image.img}
                                        className=" mx-auto my-auto object-contain max-h-40 cursor-pointer"
                                        onClick={() => {
                                            Swal.fire({
                                                title: image.img,
                                                imageUrl: image.image_url,
                                                imageAlt: image.img,
                                                showCloseButton: true,
                                                showConfirmButton: false,
                                                width: '80%',
                                                height: '80%',
                                                padding: '1em',
                                                background: '#fff',
                                                customClass: {
                                                    popup: 'rounded-lg shadow-lg',
                                                    title: 'text-lg font-semibold text-gray-700',
                                                }
                                            });

                                            setSelectedImageName(image.img);
                                        }}
                                    />
                                    <button
                                        className="h-8 w-8 absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-100 hover:opacity-100 transition"
                                        onClick={() => handleDeleteImage(image.image_id)}
                                    >
                                        <i className="ti ti-x text-xl text-white"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImageBody