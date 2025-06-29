import React, {useState} from 'react'
import Aside from '../component/Aside'
import ImageHeader from '../component/Image/ImageHeader'
import ImageBody from '../component/Image/ImageBody'

const Image = () => {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);


    return (
        <main>
            <div id="main-wrapper" class="flex p-5 xl:pr-0">
                <Aside/>
                <div class=" w-full page-wrapper xl:px-6 px-0">
                    <main class="h-full  max-w-full">
                        <div class="container full-container p-0 flex flex-col gap-6">
                            <ImageHeader
                                images={images}
                                setImages={setImages}
                                filteredImages={filteredImages}
                                setFilteredImages={setFilteredImages}
                            />
                            <ImageBody
                                images={images}
                                setImages={setImages}
                                filteredImages={filteredImages}
                                setFilteredImages={setFilteredImages}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </main>
    )
}

export default Image