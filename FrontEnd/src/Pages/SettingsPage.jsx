import React, { useState } from "react";
import Sidebar from "../Components/sidebar";
import { uploadToCloudinary } from "../actions/cloudinaryAction"; // Adjust the import path as necessary
import { useUser } from "../context/UserContext";
import axios from "axios";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { setUser, user } = useUser();

  const [formData, setFormData] = useState({
    organizationName: user?.orgName || "",
    aboutOrganization: user?.orgAbout || "",
    organizationLogo: null,
    organizationImageUrl: user?.userImage || null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      organizationLogo: file,
    }));
    const imgURL = await uploadToCloudinary(file);

    if (!imgURL) {
      console.error("Image upload failed");
      return;
    }

    // Update the formData state with the new image and URL
    setFormData((prev) => ({
      ...prev,
      organizationImageUrl: imgURL,
    }));

    console.log("Image uploaded. URL:", imgURL);
  };

  const handleDeleteImage = () => {
    setFormData((prev) => ({
      ...prev,
      organizationLogo: null,
      organizationImageUrl: null,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();

    try {
      // Prepare payload for backend
      const payload = {
        orgName: formData.organizationName,
        orgAbout: formData.aboutOrganization,
        userImage: formData.organizationImageUrl,
        uid: user?.firebaseUid,
      };

      // Call your backend API (adjust the URL if needed)
      const res = await axios.post("/api/users/update-profile", payload, {
        withCredentials: true, // if you use cookies/auth
      });

      // Update user context with new data
      if (res.data && res.data.user) {
        setUser(res.data.user);

        setIsEditing(false);
      }

      console.log("Profile data saved:", res.data.user);
    } catch (err) {
      console.error("Failed to update profile:", err);
      // Optionally show error to user
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-8 ml-20">
        <h2 className="text-[35px] text-left font-bold mb-6">Settings</h2>
        <p className="text-left mb-6 "> Manage your account settings </p>
        <div className="border-b border-gray-300 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "other"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("other")}
            >
              Other Settings
            </button>
          </nav>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={handleSaveClick} className="max-w-xl">
            <div className="mb-6 flex flex-col items-center">
              <div className="relative w-32 h-32 justify-left mb-4 mr-5 cursor-pointer">
                {formData.organizationImageUrl ? (
                  <>
                    <img
                      src={
                        formData.organizationLogo
                          ? URL.createObjectURL(formData.organizationLogo)
                          : formData.organizationImageUrl
                      }
                      alt="Organization Logo"
                      className="w-32 h-32 rounded-full object-cover border border-gray-300"
                      onClick={() =>
                        document.getElementById("organizationLogoInput").click()
                      }
                    />
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      title="Delete Image"
                    >
                      &times;
                    </button>
                  </>
                ) : (
                  <div
                    className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border border-gray-300"
                    onClick={() =>
                      document.getElementById("organizationLogoInput").click()
                    }
                  >
                    Click to add image
                  </div>
                )}
                <input
                  type="file"
                  id="organizationLogoInput"
                  name="organizationLogo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="w-full">
                {!isEditing ? (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-gray-700 font-semibold">
                        Name of Organization
                      </label>
                      <button
                        type="button"
                        onClick={handleEditClick}
                        className="text-teal-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="border border-gray-300 rounded-md p-2">
                      {formData.organizationName || "N/A"}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label
                      htmlFor="organizationName"
                      className="block text-gray-700 font-semibold mb-1"
                    >
                      Name of Organization
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                )}

                {!isEditing ? (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-gray-700 font-semibold">
                        About Organization
                      </label>
                      <button
                        type="button"
                        onClick={handleEditClick}
                        className="text-teal-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="border border-gray-300 rounded-md p-2 whitespace-pre-wrap">
                      {formData.aboutOrganization || "N/A"}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label
                      htmlFor="aboutOrganization"
                      className="block text-gray-700 font-semibold mb-1"
                    >
                      About Organization
                    </label>
                    <textarea
                      id="aboutOrganization"
                      name="aboutOrganization"
                      value={formData.aboutOrganization}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={4}
                      required
                    />
                  </div>
                )}

                {isEditing && (
                  <button
                    type="submit"
                    className="bg-teal-600 text-white font-semibold py-2 px-4 rounded hover:bg-teal-700 transition"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        {activeTab === "other" && (
          <div>
            <p>Other settings content goes here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
