/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Shield, Eye, Lock, Upload, CheckCircle, AlertCircle, Info, FileText, ChevronRight } from "lucide-react";

const Security = ({
  contestType = 'closed',
  onContestTypeChange,
  closedContestType = 'pre-registration',
  onClosedContestTypeChange,
  authenticationField = '',
  onAuthenticationFieldChange,
  customVoters = [],
  setCustomVoters,
  isVoterRegistrationEnabled,
  onToggleVoterRegistration,
  payment = { isPaid: false, amount: 0 },
  onPaymentChange,
  allowMultipleVotes = false,
  onAllowMultipleVotesChange,
  isVoteCountVisible = true,
  onVoteCountVisibilityChange,
  resultRevealSetting = 'immediately',
  onResultRevealSettingChange,
  revealDate = '',
  onRevealDateChange,
  revealTime = { revealHour: '', revealMinute: '00', revealAmPm: 'AM' },
  onRevealTimeChange,
  // Add preview data for the summary
  previewData = null
}) => {
  const [headers, setHeaders] = useState([]);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError("");
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData.length === 0) {
          setUploadError("The uploaded file is empty.");
          return;
        }

        const columnHeaders = Object.keys(jsonData[0]);
        setHeaders(columnHeaders);

        const parsedVoters = jsonData.map(row => {
          let nameStr = "";
          let emailStr = "";

          Object.keys(row).forEach(key => {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes("name") && !nameStr) nameStr = row[key];
            if (lowerKey.includes("email") && !emailStr) emailStr = row[key];
          });

          return {
            name: nameStr || "Anonymous",
            email: emailStr,
            customData: row
          };
        });

        if (setCustomVoters) {
          setCustomVoters(parsedVoters);
        }

        if (!authenticationField && columnHeaders.length > 0 && onAuthenticationFieldChange) {
          onAuthenticationFieldChange(columnHeaders[0]);
        }
      } catch (err) {
        console.error(err);
        setUploadError("Failed to parse file. Please ensure it is a valid CSV or Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 1. Security Logic Section: Who can vote? */}
      <div className="bg-[#FBF7F7] p-6 lg:p-10 rounded-2xl border border-orange-50 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="text-orange-500" />
          Who can vote?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Open Contest Card */}
          <div
            onClick={() => onContestTypeChange && onContestTypeChange('open')}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${contestType === 'open' ? 'border-orange-500 bg-white shadow-xl' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${contestType === 'open' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <Eye size={24} />
              </div>
              {contestType === 'open' && <CheckCircle size={20} className="text-orange-500" />}
            </div>
            <h3 className="font-bold text-lg text-gray-900">Anyone can vote</h3>
            <p className="text-sm text-gray-500 mt-2">Public contest. Voters authenticate via Google to ensure "One User, One Vote".</p>

            {contestType === 'open' && (
              <div className="mt-4 pt-4 border-t border-orange-50 text-[10px] uppercase font-bold text-orange-600 flex items-center gap-1">
                <Info size={12} /> Google Auth will be required
              </div>
            )}
          </div>

          {/* Closed Contest Card */}
          <div
            onClick={() => onContestTypeChange && onContestTypeChange('closed')}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${contestType === 'closed' ? 'border-orange-500 bg-white shadow-xl' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${contestType === 'closed' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <Lock size={24} />
              </div>
              {contestType === 'closed' && <CheckCircle size={20} className="text-orange-500" />}
            </div>
            <h3 className="font-bold text-lg text-gray-900">Private restricted list</h3>
            <p className="text-sm text-gray-500 mt-2">Only specific people you approve can vote. Perfect for internal or paid elections.</p>
          </div>
        </div>

        {/* Closed Contest Fine-Tuning */}
        {contestType === 'closed' && (
          <div className="mt-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="bg-white p-2 rounded-xl border border-gray-100 flex gap-2">
              <button
                onClick={() => onClosedContestTypeChange && onClosedContestTypeChange('pre-registration')}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${closedContestType === 'pre-registration' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Voters Register Themselves
              </button>
              <button
                onClick={() => onClosedContestTypeChange && onClosedContestTypeChange('bulk-upload')}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${closedContestType === 'bulk-upload' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                I will Upload Voter List
              </button>
            </div>

            {closedContestType === 'pre-registration' ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                <div className="p-2 bg-blue-500 text-white rounded-lg h-fit"><Info size={20} /></div>
                <div>
                  <h4 className="font-bold text-blue-900">How it works</h4>
                  <p className="text-sm text-blue-800 mt-1">Voters will see a "Join Contest" button. They enter their email, receive a secure code, and can then cast their vote once confirmed.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-white hover:border-orange-300 transition-colors cursor-pointer group" onClick={() => document.getElementById('voter-upload').click()}>
                  <Upload className="mx-auto h-12 w-12 text-gray-300 group-hover:text-orange-500 transition-colors mb-4" />
                  <p className="text-gray-900 font-bold">Upload Approved Voters</p>
                  <p className="text-xs text-gray-500 mt-1 italic">Excel or CSV files only</p>
                  <input id="voter-upload" type="file" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} className="hidden" />
                  {customVoters.length > 0 && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold border border-green-100">
                      <CheckCircle size={14} /> {customVoters.length} Voters Loaded
                    </div>
                  )}
                  {uploadError && <p className="mt-4 text-red-500 text-xs font-bold">{uploadError}</p>}
                </div>

                {customVoters.length > 0 && (
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Smart Verification Field</label>
                    <p className="text-xs text-gray-600 mb-4 italic">Choose the column (e.g. Matric No, Staff ID) that voters will use to verify themselves. We'll cross-check their entry against this list.</p>
                    <select
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-500"
                      value={authenticationField}
                      onChange={(e) => onAuthenticationFieldChange && onAuthenticationFieldChange(e.target.value)}
                    >
                      {headers.map(h => <option key={h} value={h}>{h.toUpperCase()}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Global Contest Configuration: Billing, Policy, Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Paid Contest Section */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-gray-900">Paid Contest</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={payment?.isPaid || false}
                onChange={(e) => onPaymentChange({ ...payment, isPaid: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">Enable this to charge voters a fee before they can cast their vote. Revenue will be sent to your connected wallet.</p>

          {payment?.isPaid && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Amount per Vote (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₦</span>
                <input
                  type="number"
                  value={payment?.amount || ''}
                  onChange={(e) => onPaymentChange({ ...payment, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Voting & Visibility Section */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-6">
            {/* Multiple Votes Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Allow Multiple Votes</h3>
                  <p className="text-[10px] text-gray-400">Can a user vote more than once?</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={allowMultipleVotes}
                  onChange={(e) => onAllowMultipleVotesChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="h-px bg-gray-50 w-full" />

            {/* Vote Count Visibility Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Live Results</h3>
                  <p className="text-[10px] text-gray-400">Show vote counts during contest.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isVoteCountVisible}
                  onChange={(e) => onVoteCountVisibilityChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Advanced Reveal Settings (Conditional) */}
      {!isVoteCountVisible && (
        <div className="bg-[#111827] text-white p-8 lg:p-10 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500 border border-gray-800 shadow-orange-500/10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/3">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-orange-400">
                <Lock size={24} />
                Result Reveal
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Since you've hidden live results, you need to decide when the public and contestants can see the final counts.
              </p>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 gap-4">
              {[
                { id: 'immediately', title: 'Immediately', desc: 'Reveal as soon as the contest timer hits zero.', icon: <CheckCircle /> },
                { id: 'scheduled', title: 'Scheduled Reveal', desc: 'Results will stay hidden until your chosen date/time.', icon: <Info /> },
                { id: 'manual', title: 'Manual Release', desc: 'You must manually click "Reveal Results" on your dashboard.', icon: <Lock /> }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => onResultRevealSettingChange(opt.id)}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-5 ${resultRevealSetting === opt.id ? 'border-orange-500 bg-gray-800/50' : 'border-gray-800 bg-transparent hover:border-gray-700'}`}
                >
                  <div className={`p-3 rounded-xl ${resultRevealSetting === opt.id ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{opt.title}</h4>
                    <p className="text-xs text-gray-400 uppercase font-medium tracking-wide mt-1">{opt.desc}</p>
                  </div>
                  {resultRevealSetting === opt.id && <CheckCircle size={20} className="text-orange-500" />}
                </div>
              ))}

              {resultRevealSetting === 'scheduled' && (
                <div className="mt-4 p-6 bg-gray-800/30 rounded-2xl border border-gray-700 space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-orange-400 uppercase mb-2">Reveal Date</label>
                      <input
                        type="date"
                        value={revealDate}
                        onChange={(e) => onRevealDateChange(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-orange-400 uppercase mb-2">Reveal Time</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="12"
                          value={revealTime?.revealHour || ''}
                          onChange={(e) => onRevealTimeChange({ ...revealTime, revealHour: e.target.value })}
                          className="w-16 bg-gray-900 border border-gray-700 rounded-xl px-3 py-3 text-white text-center outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                        />
                        <input
                          type="text"
                          placeholder="00"
                          value={revealTime?.revealMinute || ''}
                          onChange={(e) => onRevealTimeChange({ ...revealTime, revealMinute: e.target.value })}
                          className="w-16 bg-gray-900 border border-gray-700 rounded-xl px-3 py-3 text-white text-center outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                        />
                        <select
                          value={revealTime?.revealAmPm || 'AM'}
                          onChange={(e) => onRevealTimeChange({ ...revealTime, revealAmPm: e.target.value })}
                          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Final Review Section */}
      <div className="bg-white p-6 lg:p-10 rounded-2xl border border-gray-100 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 scale-150 opacity-5 pointer-events-none">
          <Eye size={100} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-8">Final Review</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contest Name</span>
            <p className="font-bold text-gray-900 text-lg leading-tight">{previewData?.contestName || "Untitled Contest"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</span>
            <p className="font-medium text-gray-700">Starts: {previewData?.startDate || "Not set"}</p>
            <p className="text-xs text-red-500 font-bold">Ends: {previewData?.endDate || "Not set"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Participants</span>
            <p className="font-bold text-gray-900 text-lg leading-tight">{previewData?.contestantCount || 0} Contestants</p>
            <p className="text-xs text-orange-500 font-bold">{previewData?.positionCount || 0} Positions Created</p>
          </div>
        </div>

        <div className="mt-10 p-5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
              <FileText className="text-orange-500" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900">Ready to launch?</h5>
              <p className="text-xs text-gray-500">Double check all details. They can't be changed once live.</p>
            </div>
          </div>
          <button className="text-orange-500 font-bold text-sm hover:underline flex items-center gap-1">
            Edit Details <ChevronRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Security;
