import React, {useEffect, useState} from 'react'
import { API_ENDPOINTS, axiosInstance, API } from '../APIConfig';
import JoditEditor from 'jodit-react';
import 'jodit/es5/jodit.css';

const config = {
    readonly: false,
    height: 400,
    placeholder: 'Start typing...',
    uploader: {
        insertImageAsBase64URI: true,
    },
};

const TextFieldBody = ({formData, setFormData}) => {
    const [isEnabled, setIsEnabled] = useState(false || 0);

    useEffect(() => {
        if (formData.display === 1) {
            setIsEnabled(true);
        } else {
            setIsEnabled(false);
        }
    }, [formData.display]);

    return (
        <div>
            <div class="card ">
                <div class="card-body !py-2">
                    <div class=" !mb-5 ">
                        <div class="mb-3 ">
                            <h4 class="text-gray-500 text-lg font-semibold mb-2">Type</h4>
                            <select
                                value={formData.t_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, t_type: e.target.value }))}
                                class="py-2.5 w-full px-4 text-gray-500 block border-gray-200 rounded-sm text-md focus:border-blue-600 focus:ring-0">
                                <option value="0" selected>Choose a type</option>
                                <option value="1">Name</option>
                                <option value="2">Role</option>
                                <option value="3">Menu</option>
                                <option value="4">About</option>
                                <option value="5">Map</option>
                            </select>
                        </div>
                        <div class="mb-6 ">
                            <h4 class="text-gray-500 text-lg font-semibold mb-2">Details</h4>
                            <JoditEditor
                                value={formData.t_detail}
                                config={config}
                                onChange={(newContent) => setFormData(prev => ({ ...prev, t_detail: newContent } ))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class=" flex justify-end gap-2">
                <div class="mt-3 ">
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
    )
}

export default TextFieldBody