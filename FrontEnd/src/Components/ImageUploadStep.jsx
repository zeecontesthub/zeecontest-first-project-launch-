<<<<<<< HEAD
<<<<<<< HEAD
import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';
=======
import React, { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8

const ImageUploadStep = ({
  coverImage,
  logoImage,
  onFileUpload = () => {},
  isUploading = false,
}) => {
  const handleDragOver = (e) => e.preventDefault();
  const [isType, setIsType] = useState("");

  const handleDrop = (e, type) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && !isUploading) {
      onFileUpload(files[0], type);
    }
  };

  useEffect(() => {
    return () => {
      if (coverImage && typeof coverImage !== "string") {
        URL.revokeObjectURL(coverImage.preview);
      }
      if (logoImage && typeof logoImage !== "string") {
        URL.revokeObjectURL(logoImage.preview);
      }
    };
  }, [coverImage, logoImage]);

  const FileUploadArea = ({ type, title, file }) => (
    <div className="mb-6 sm:mb-8 relative">
      {isUploading && isType === type && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
          <Loader2 className="animate-spin w-8 h-8 sm:w-10 sm:h-10 text-white mb-2" />
          <p className="text-white text-xs sm:text-sm">Uploading...</p>
        </div>
      )}

      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        {title}
      </h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-6">
        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
          Upload File
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 lg:p-12 text-center transition-colors cursor-pointer ${
            isUploading
              ? "border-gray-300 cursor-not-allowed opacity-50"
              : "hover:border-orange-400 border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDrop={(e) => !isUploading && handleDrop(e, type)}
          onClick={() => {
            setIsType(type);
            !isUploading &&
              document.getElementById(`file-input-${type}`).click();
          }}
        >
          <FileText className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mb-3 sm:mb-4" />
          
          {/* Mobile-first text layout */}
          <div className="space-y-2 sm:space-y-1">
            <p className="text-sm sm:text-base text-gray-600">
              <span className="hidden sm:inline">Drag and Drop your Image here</span>
              <span className="sm:hidden">Tap to select image</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Or</p>
          </div>
          
          <button
            disabled={isUploading}
            className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base w-full sm:w-auto ${
              isUploading
                ? "bg-orange-400 text-white cursor-not-allowed opacity-50"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            Browse Files
          </button>
          <input
            id={`file-input-${type}`}
            type="file"
            accept="image/*"
            onChange={(e) =>
              !isUploading && onFileUpload(e.target.files[0], type)
            }
            className="hidden"
          />
        </div>
        
        {/* Image Preview */}
        {file && (
          <div className="mt-3 sm:mt-4">
            <div className="relative">
              <img
                src={typeof file === "string" ? file : URL.createObjectURL(file)}
                alt={type}
                className="max-h-32 sm:max-h-48 lg:max-h-64 w-full object-contain mx-auto rounded border border-gray-200"
              />
              {/* Image info overlay for mobile */}
              <div className="sm:hidden absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {typeof file === "string" ? "Current image" : file.name}
              </div>
            </div>
            
            {/* Image details for larger screens */}
            <div className="hidden sm:block mt-2 text-center">
              <p className="text-xs text-gray-500">
                {typeof file === "string" ? "Current image" : `${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 text-left bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 relative">
      {/* Header - Optional, can be added if needed */}
      <div className="sm:hidden mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Upload Images</h2>
        <p className="text-sm text-gray-600 mt-1">Add cover and logo images for your contest</p>
      </div>
      
      <FileUploadArea type="cover" title="Cover Image" file={coverImage} />
      <FileUploadArea type="logo" title="Contest Logo" file={logoImage} />
      
      {/* Mobile-specific tips */}
      <div className="sm:hidden bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Tips:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use high-quality images for best results</li>
          <li>• Recommended: Cover image 1200x600px, Logo 300x300px</li>
          <li>• Supported formats: JPG, PNG, GIF</li>
        </ul>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ImageUploadStep;
=======
import React, { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

const ImageUploadStep = ({
  coverImage,
  logoImage,
  onFileUpload = () => {},
  isUploading = false,
}) => {
  const handleDragOver = (e) => e.preventDefault();
  const [isType, setIsType] = useState("");

  const handleDrop = (e, type) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && !isUploading) {
      onFileUpload(files[0], type);
    }
  };

  useEffect(() => {
    return () => {
      if (coverImage && typeof coverImage !== "string") {
        URL.revokeObjectURL(coverImage.preview);
      }
      if (logoImage && typeof logoImage !== "string") {
        URL.revokeObjectURL(logoImage.preview);
      }
    };
  }, [coverImage, logoImage]);

  const FileUploadArea = ({ type, title, file }) => (
    <div className="mb-6 sm:mb-8 relative">
      {isUploading && isType === type && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
          <Loader2 className="animate-spin w-8 h-8 sm:w-10 sm:h-10 text-white mb-2" />
          <p className="text-white text-xs sm:text-sm">Uploading...</p>
        </div>
      )}

      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        {title}
      </h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-6">
        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
          Upload File
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 lg:p-12 text-center transition-colors cursor-pointer ${
            isUploading
              ? "border-gray-300 cursor-not-allowed opacity-50"
              : "hover:border-orange-400 border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDrop={(e) => !isUploading && handleDrop(e, type)}
          onClick={() => {
            setIsType(type);
            !isUploading &&
              document.getElementById(`file-input-${type}`).click();
          }}
        >
          <FileText className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mb-3 sm:mb-4" />
          
          {/* Mobile-first text layout */}
          <div className="space-y-2 sm:space-y-1">
            <p className="text-sm sm:text-base text-gray-600">
              <span className="hidden sm:inline">Drag and Drop your Image here</span>
              <span className="sm:hidden">Tap to select image</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Or</p>
          </div>
          
          <button
            disabled={isUploading}
            className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base w-full sm:w-auto ${
              isUploading
                ? "bg-orange-400 text-white cursor-not-allowed opacity-50"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            Browse Files
          </button>
          <input
            id={`file-input-${type}`}
            type="file"
            accept="image/*"
            onChange={(e) =>
              !isUploading && onFileUpload(e.target.files[0], type)
            }
            className="hidden"
          />
        </div>
        
        {/* Image Preview */}
        {file && (
          <div className="mt-3 sm:mt-4">
            <div className="relative">
              <img
                src={typeof file === "string" ? file : URL.createObjectURL(file)}
                alt={type}
                className="max-h-32 sm:max-h-48 lg:max-h-64 w-full object-contain mx-auto rounded border border-gray-200"
              />
              {/* Image info overlay for mobile */}
              <div className="sm:hidden absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {typeof file === "string" ? "Current image" : file.name}
              </div>
            </div>
            
            {/* Image details for larger screens */}
            <div className="hidden sm:block mt-2 text-center">
              <p className="text-xs text-gray-500">
                {typeof file === "string" ? "Current image" : `${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 text-left bg-[#FBF7F7] p-4 sm:p-6 lg:p-10 relative">
      {/* Header - Optional, can be added if needed */}
      <div className="sm:hidden mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Upload Images</h2>
        <p className="text-sm text-gray-600 mt-1">Add cover and logo images for your contest</p>
      </div>
      
      <FileUploadArea type="cover" title="Cover Image" file={coverImage} />
      <FileUploadArea type="logo" title="Contest Logo" file={logoImage} />
      
      {/* Mobile-specific tips */}
      <div className="sm:hidden bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Tips:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use high-quality images for best results</li>
          <li>• Recommended: Cover image 1200x600px, Logo 300x300px</li>
          <li>• Supported formats: JPG, PNG, GIF</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploadStep;
>>>>>>> oscar-branch
=======
export default ImageUploadStep;
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
