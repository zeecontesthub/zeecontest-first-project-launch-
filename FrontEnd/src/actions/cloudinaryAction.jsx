import axios from "axios";

// Access environment variables
// Access environment variables and trim whitespace/quotes if any remain
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim().replace(/['"]/g, '');
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim().replace(/['"]/g, '');

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export async function uploadToCloudinary(file) {
  if (!file) {
    console.error("No file provided for upload");
    return null;
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    console.error("Cloudinary configuration missing. Check your .env file.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await axios.post(CLOUDINARY_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.secure_url;
  } catch (e) {
    const errorMsg = e.response?.data?.error?.message || e.message;
    console.error("Cloudinary Upload failed:", errorMsg);
    return null;
  }
}
