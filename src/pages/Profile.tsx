import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { UserCircleIcon, KeyIcon } from '@heroicons/react/24/outline';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Admin User',
    email: 'admin@foodo.com',
    role: 'Administrator',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password change functionality - Implement form');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-16 w-16 text-gray-400" />
              )}
              {isEditing && (
                <button type="button" className="btn btn-secondary text-sm">
                  Change Avatar
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input mt-1"
                value={isEditing ? formData.name : profile.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input mt-1"
                value={isEditing ? formData.email : profile.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                className="input mt-1"
                value={profile.role}
                disabled
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Security Settings */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <KeyIcon className="h-6 w-6 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">Security</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input mt-1"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
