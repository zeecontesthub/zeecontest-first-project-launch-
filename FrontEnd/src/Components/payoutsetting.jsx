import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const PayoutSetting = ({ isOpen, onClose, onSave }) => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (bankName.trim() === "") {
      toast.error("Bank Name is required");
      return;
    }
    if (accountNumber.trim() === "") {
      toast.error("Bank Account Number is required");
      return;
    }
    if (accountHolderName.trim() === "") {
      toast.error("Account Holder Name is required");
      return;
    }
    onSave({ bankName, accountNumber, accountHolderName });
    setBankName("");
    setAccountNumber("");
    setAccountHolderName("");
  };

  const handleClose = () => {
    setBankName("");
    setAccountNumber("");
    setAccountHolderName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close popup"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name of Account Holder
            </label>
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="Enter account holder name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutSetting;
