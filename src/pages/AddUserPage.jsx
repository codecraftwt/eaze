import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AddUserPage = () => {
    const dispatch = useDispatch();
  const { salesforceToken, portalUserId } = useSelector((state) => state.auth);
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
    alert("User data captured!");
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
                className="bg-[#1D4ED8] hover:bg-blue-700 text-white px-10 py-2.5 rounded-lg font-medium text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;