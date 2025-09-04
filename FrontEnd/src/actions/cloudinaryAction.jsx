import axios from "axios";

// Access environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await axios.post(CLOUDINARY_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.secure_url;
  } catch (e) {
    console.error("Upload failed", e.message);
    return null;
  }
}
