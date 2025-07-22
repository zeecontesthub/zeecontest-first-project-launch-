import React, { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

const ImageUploadStep = ({
  coverImage,
  logoImage,
  onFileUpload,
  isUploading,
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
    <div className="mb-8 relative">
      {isUploading && isType === type && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
          <Loader2 className="animate-spin w-10 h-10 text-white mb-2" />
          <p className="text-white text-sm">Uploading...</p>
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Upload File
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
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
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Drag and Drop your Image here</p>
          <p className="text-gray-500 mb-4">Or</p>
          <button
            disabled={isUploading}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isUploading
                ? "bg-orange-400 text-white cursor-not-allowed opacity-50"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            Browse
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
        {file && (
          <div className="mt-4">
            <img
              src={typeof file === "string" ? file : URL.createObjectURL(file)}
              alt={type}
              className="max-h-64 mx-auto rounded"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 text-left bg-[#FBF7F7] p-10 relative">
      <FileUploadArea type="cover" title="Cover Images" file={coverImage} />
      <FileUploadArea type="logo" title="Contest Logo Image" file={logoImage} />
    </div>
  );
};

export default ImageUploadStep;
