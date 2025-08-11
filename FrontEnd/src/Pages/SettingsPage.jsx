import React, { useState, useEffect } from "react";
import Sidebar from "../Components/sidebar";
import { uploadToCloudinary } from "../actions/cloudinaryAction"; // Adjust the import path as necessary
import { useUser } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { setUser, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

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
    if (!e.target.files || e.target.files.length === 0) {
      console.error("No file selected");
      return;
    }
    setIsLoading(true);

    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      organizationLogo: file,
    }));
    
    try {
      const imgURL = await uploadToCloudinary(file);

      if (!imgURL) {
        toast.error("Image upload failed");
        setIsLoading(false);
        return;
      }

      // Update the formData state with the new image and URL
      setFormData((prev) => ({
        ...prev,
        organizationImageUrl: imgURL,
      }));

      console.log("Image uploaded. URL:", imgURL);
    } catch (error) {
      toast.error("Image upload failed");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      organizationName: user?.orgName || "",
      aboutOrganization: user?.orgAbout || "",
      organizationLogo: null,
      organizationImageUrl: user?.userImage || null,
    });
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
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }

      console.log("Profile data saved:", res.data.user);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.organizationLogo) {
        URL.revokeObjectURL(URL.createObjectURL(formData.organizationLogo));
      }
    };
  }, [formData.organizationLogo]);

  const getImageSrc = () => {
    if (formData.organizationLogo) {
      return URL.createObjectURL(formData.organizationLogo);
    }
    return formData.organizationImageUrl;
  };

  const renderProfileImage = () => {
    const imageSrc = getImageSrc();
    
    return (
      <div className="relative group">
        <div className="relative w-40 h-40 mx-auto">
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                alt="Organization Logo"
                className="w-30 h-30 rounded-full object-cover border-4 border-teal-900 shadow-xl cursor-pointer transition-all duration-300 group-hover:shadow-2xl"
                onClick={() => document.getElementById("organizationLogoInput").click()}
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 z-10"
                title="Delete Image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <div
              className="w-40 h-40 rounded-2xl border-3 border-dashed border-gray-300 hover:border-teal-400 bg-gray-50 hover:bg-teal-50 flex flex-col items-center justify-center text-gray-500 hover:text-teal-600 cursor-pointer transition-all duration-300 group-hover:shadow-lg"
              onClick={() => document.getElementById("organizationLogoInput").click()}
            >
              <svg className="w-12 h-12 mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">Upload Image</span>
              <span className="text-xs opacity-60 mt-1">Click to browse</span>
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <div className="flex flex-col items-center space-y-3 text-white">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Uploading...</span>
              </div>
            </div>
          )}
        </div>
        
        <input
          type="file"
          id="organizationLogoInput"
          name="organizationLogo"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-20 ">
        {/* Header Section */}
        <div className="mb-10 text-left ">
          <h2 className="text-[30px] font-bold text-gray-900 mb-3">Settings</h2>
          <p className="text-gray-600 text-lg">Manage your account settings and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className=" mb-8">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              className={`relative py-4 px-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "profile"
                  ? "text-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
              {activeTab === "profile" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
              )}
            </button>
            <button
              className={`relative py-4 px-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "other"
                  ? "text-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("other")}
            >
              Other Settings
              {activeTab === "other" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <form onSubmit={handleSaveClick} className="p-8">
              {/* Profile Image Section */}
              <div className="text-center mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Organization Profile</h2>
                {renderProfileImage()}
              </div>

              {/* Form Fields */}
              <div className="max-w-2xl mx-auto space-y-8">
                {/* Organization Name */}
                <div className="bg-gray-50 rounded-xl p-6 transition-all duration-200 hover:bg-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <label className="block text-sm font-semibold text-gray-900">
                      Name of Organization
                    </label>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={handleEditClick}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors duration-200 text-gray-900 font-medium"
                      placeholder="Enter organization name"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-white border-2 border-transparent rounded-xl text-gray-900 font-medium">
                      {formData.organizationName || (
                        <span className="text-gray-400 italic">No organization name set</span>
                      )}
                    </div>
                  )}
                </div>

                {/* About Organization */}
                <div className="bg-gray-50 rounded-xl p-6 transition-all duration-200 hover:bg-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <label className="block text-sm font-semibold text-gray-900">
                      About Organization
                    </label>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={handleEditClick}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <textarea
                      id="aboutOrganization"
                      name="aboutOrganization"
                      value={formData.aboutOrganization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 transition-colors duration-200 text-gray-900 resize-none"
                      rows={5}
                      placeholder="Tell us about your organization"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-white border-2 border-transparent rounded-xl text-gray-900 min-h-[100px]">
                      {formData.aboutOrganization ? (
                        <span className="whitespace-pre-wrap">{formData.aboutOrganization}</span>
                      ) : (
                        <span className="text-gray-400 italic">No description provided</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl hover:from-teal-700 hover:to-teal-800 focus:ring-4 focus:ring-teal-300 transition-all duration-200 shadow-lg hover:shadow-xl ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Other Settings Tab Content */}
        {activeTab === "other" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Other Settings</h3>
              <p className="text-gray-500">Additional settings will be available here soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;