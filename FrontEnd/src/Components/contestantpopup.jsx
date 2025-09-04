<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState } from "react";
import { uploadToCloudinary } from "../actions/cloudinaryAction";
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8

const defaultPositions = [
  { id: 1, name: "President" },
  { id: 2, name: "Vice President" },
  { id: 3, name: "Sport Director" },
  { id: 4, name: "Secretary" },
  { id: 5, name: "Treasurer" },
];

const ContestantPopup = ({
  isOpen,
  onClose,
  onAddContestant,
  positions = defaultPositions,
}) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
<<<<<<< HEAD
=======
import React, { useState } from "react";
import { uploadToCloudinary } from "../actions/cloudinaryAction";

const defaultPositions = [
  { id: 1, name: "President" },
  { id: 2, name: "Vice President" },
  { id: 3, name: "Sport Director" },
  { id: 4, name: "Secretary" },
  { id: 5, name: "Treasurer" },
];

const ContestantPopup = ({
  isOpen,
  onClose,
  onAddContestant,
  positions = defaultPositions,
}) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
>>>>>>> oscar-branch
=======
  const [isUploading, setIsUploading] = useState(false);
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && position) {
<<<<<<< HEAD
<<<<<<< HEAD
      onAddContestant({ name, position, bio, imageFile });
      setName('');
      setPosition('');
      setBio('');
      setImageFile(null);
=======
      onAddContestant({ name, position, bio, image: imageFile, email });

      setName("");
      setPosition("");
      setBio("");
      setImageFile(null);
      setEmail("");
>>>>>>> oscar-branch
=======
      onAddContestant({ name, position, bio, image: imageFile, email });

      setName("");
      setPosition("");
      setBio("");
      setImageFile(null);
      setEmail("");
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
      onClose();
    }
  };

<<<<<<< HEAD
<<<<<<< HEAD
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
=======
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
=======
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
      setIsUploading(true);
      try {
        const imgURL = await uploadToCloudinary(e.target.files[0]);
        setImageFile(imgURL);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
<<<<<<< HEAD
>>>>>>> oscar-branch
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/50 bg-opacity-50 flex items-center justify-center z-50">
<<<<<<< HEAD
<<<<<<< HEAD
      <div className="bg-white rounded-lg p-6 w-96">
=======
      <div className="bg-white rounded-lg p-6 w-96 relative">
>>>>>>> oscar-branch
=======
      <div className="bg-white rounded-lg p-6 w-96 relative">
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
        <h2 className="text-lg font-semibold mb-4">Add Contestant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
<<<<<<< HEAD
<<<<<<< HEAD
=======
              disabled={isUploading}
>>>>>>> oscar-branch
=======
              disabled={isUploading}
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
<<<<<<< HEAD
<<<<<<< HEAD
            >
              <option value="">Select position</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.name}>{pos.name}</option>
=======
              disabled={isUploading}
            >
              <option value="">Select position</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.name}>
                  {pos.name}
                </option>
>>>>>>> oscar-branch
=======
              disabled={isUploading}
            >
              <option value="">Select position</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.name}>
                  {pos.name}
                </option>
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
<<<<<<< HEAD
<<<<<<< HEAD
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
=======
              disabled={isUploading}
            />
          </div>
          <div>
=======
              disabled={isUploading}
            />
          </div>
          <div>
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={isUploading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Image
            </label>
<<<<<<< HEAD
>>>>>>> oscar-branch
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
            <div className="relative">
              <input
                type="text"
                readOnly
<<<<<<< HEAD
<<<<<<< HEAD
                value={imageFile ? imageFile.name : ''}
=======
                value={
                  isUploading
                    ? "Uploading..."
                    : imageFile
                    ? typeof imageFile === "string"
                      ? imageFile.split("/").pop()
                      : imageFile.name
                    : ""
                }
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
                placeholder="No file chosen"
                className={`w-full border border-gray-300 rounded px-3 py-3 pr-28 ${
                  isUploading ? "text-gray-400 italic" : ""
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  !isUploading &&
                  document.getElementById("image-upload-input").click()
                }
                disabled={isUploading}
                className={`absolute right-1 top-1 bottom-1 px-4 py-2 rounded ${
                  isUploading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                } transition-colors`}
              >
<<<<<<< HEAD
                Upload
=======
                value={
                  isUploading
                    ? "Uploading..."
                    : imageFile
                    ? typeof imageFile === "string"
                      ? imageFile.split("/").pop()
                      : imageFile.name
                    : ""
                }
                placeholder="No file chosen"
                className={`w-full border border-gray-300 rounded px-3 py-3 pr-28 ${
                  isUploading ? "text-gray-400 italic" : ""
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  !isUploading &&
                  document.getElementById("image-upload-input").click()
                }
                disabled={isUploading}
                className={`absolute right-1 top-1 bottom-1 px-4 py-2 rounded ${
                  isUploading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                } transition-colors`}
              >
                {isUploading ? "Uploading..." : "Upload"}
>>>>>>> oscar-branch
=======
                {isUploading ? "Uploading..." : "Upload"}
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
              </button>
              <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
<<<<<<< HEAD
<<<<<<< HEAD
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
=======
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
              disabled={isUploading}
              className={`px-4 py-2 rounded ${
                isUploading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
<<<<<<< HEAD
>>>>>>> oscar-branch
=======
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
            >
              Cancel
            </button>
            <button
              type="submit"
<<<<<<< HEAD
<<<<<<< HEAD
              className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
            >
              Add
=======
              disabled={isUploading}
              className={`px-4 py-2 rounded ${
                isUploading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {isUploading ? "Please wait..." : "Add"}
>>>>>>> oscar-branch
=======
              disabled={isUploading}
              className={`px-4 py-2 rounded ${
                isUploading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {isUploading ? "Please wait..." : "Add"}
>>>>>>> 4cb84f74b69a8693bca6b47fe8eeddbf07295aa8
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContestantPopup;
