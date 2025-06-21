import React, { useEffect, useRef, useState } from 'react';
import { useauthstore } from '../store/auth.store';

const Account = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useauthstore();
  const [selectedImg, setSelectedImg] = useState(null);
  const profilePictureInputRef = useRef(null);
  const profilePreviewRef = useRef(null);
  

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    bio: "",
  });
  

   const handlesubmit = (e) => {
  e.preventDefault();

  const completeData = {
    ...formData,
    ...(selectedImg && { profilePic: selectedImg }),
  };

  updateProfile(completeData);
};

  useEffect(() => {
    if (authUser) {
      setFormData({
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        address: authUser.address || "",
        city: authUser.city || "",
        state: authUser.state || "",
        zip: authUser.zip || "",
        country: authUser.country || "",
        bio: authUser.bio || "",
      });

      if (profilePreviewRef.current && authUser.profilePic) {
        profilePreviewRef.current.src = authUser.profilePic;
      }
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64Image = reader.result;
    setSelectedImg(base64Image); // store the image in state
    if (profilePreviewRef.current) {
      profilePreviewRef.current.src = base64Image;
    }
  };
  reader.readAsDataURL(file);
};




  return (
    <form onSubmit={handlesubmit} className="bg-white motion-preset-blur-right motion-duration-300   shadow-md rounded-lg p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Update Your Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: 'firstName', label: 'First Name',  },
          { id: 'lastName', label: 'Last Name',  },
        ].map(({ id, label, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              id={id}
              name={id}
              type="text"
              placeholder={placeholder}
              required
              value={formData[id]}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {[
          { id: 'city', label: 'City', placeholder: 'New York' },
          { id: 'state', label: 'State / Province', placeholder: 'NY' },
          { id: 'zip', label: 'ZIP / Postal Code', placeholder: '10001' },
        ].map(({ id, label, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              id={id}
              name={id}
              value={formData[id]}
              onChange={handleChange}
              placeholder={placeholder}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a country</option>
            {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'Japan', 'Brazil', 'Mexico'].map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <div className="flex items-center space-x-4">
            <img
              ref={profilePreviewRef}
              alt="Profile preview"
              className="h-20 w-20 rounded-full object-cover border border-gray-300"
              src="https://placehold.co/80x80/png?text=Profile"
              width="80"
              height="80"
            />
            <input
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              type="file"
              ref={profilePictureInputRef}
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i className="fas fa-save mr-2"></i>
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default Account;
