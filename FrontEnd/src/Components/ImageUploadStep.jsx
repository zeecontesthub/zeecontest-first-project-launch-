import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';

const ImageUploadStep = ({ coverImage, logoImage, onFileUpload }) => {
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onFileUpload(files[0], type);
        }
    };

    useEffect(() => {
        // Cleanup object URLs to prevent memory leaks
        return () => {
            if (coverImage && typeof coverImage !== 'string') {
                URL.revokeObjectURL(coverImage.preview);
            }
            if (logoImage && typeof logoImage !== 'string') {
                URL.revokeObjectURL(logoImage.preview);
            }
        };
    }, [coverImage, logoImage]);

    const FileUploadArea = ({ type, title, file }) => (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="text-sm font-medium text-gray-700 mb-3">Upload File</div>
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-orange-400 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, type)}
                    onClick={() => document.getElementById(`file-input-${type}`).click()}
                >
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Drag and Drop your Image here </p>
                    <p className="text-gray-500 mb-4">Or</p>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
                        Browse
                    </button>
                    <input
                        id={`file-input-${type}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => onFileUpload(e.target.files[0], type)}
                        className="hidden"
                    />
                </div>
                {file && (
                    <div className="mt-4">
                        <img
                            src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                            alt={type}
                            className="max-h-64 mx-auto rounded"
                        />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 text-left bg-[#FBF7F7] p-10">
            {/* <h2 className="text-xl text-left font-semibold text-gray-900 mb-6">Upload Images</h2> */}
            <FileUploadArea type="cover" title="Cover Images" file={coverImage} />
            <FileUploadArea type="logo" title="Contest Logo Image" file={logoImage} />
        </div>
    );
};

export default ImageUploadStep;
