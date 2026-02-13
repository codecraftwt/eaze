import { createPartnerUser } from '../store/slices/authSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AddUserPage = () => {
    const dispatch = useDispatch();
  const { salesforceToken, portalUserId ,status} = useSelector((state) => state.auth);
  const isLoading = status === "loading";
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    accountId: portalUserId // Example ID
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payload:', JSON.stringify(formData));

    dispatch(createPartnerUser(formData))
      .unwrap()
      .then(() => {
        // Clear form on success
        setFormData({ firstName: '', lastName: '', email: '', accountId: portalUserId });
      })
      .catch((err) => {
        console.error("Failed to create user:", err);
      });
    // alert("User data captured!");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto pt-12 px-4">
        
        {/* Page Header */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold text-slate-800">User Management</h1>
          <p className="text-gray-500 text-sm">Create and assign a new user to your organization.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-lg font-medium text-gray-700">Add New User</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* First Name */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. John"
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all"
                  required
                />
              </div>

              {/* Email Address - Full Width */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Footer / Action Button */}
            <div className="mt-10 flex justify-end border-t border-gray-100 pt-6">
              <button
                type="button"
                className="mr-4 px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center bg-[#1D4ED8] hover:bg-blue-700 text-white px-10 py-2.5 rounded-lg font-medium text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Add User'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;