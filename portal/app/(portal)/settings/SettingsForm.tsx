"use client";

import { useState } from "react";
import { updateProfile, changePassword } from "./actions";

export function SettingsForm({ user }: { user: { name: string, email: string } }) {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  async function handleProfileSubmit(formData: FormData) {
    setIsSavingProfile(true);
    setProfileSuccess(false);
    try {
      await updateProfile(formData);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(formData: FormData) {
    setIsSavingPassword(true);
    setPasswordSuccess(false);
    try {
      await changePassword(formData);
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
      (document.getElementById('password-form') as HTMLFormElement).reset();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
        <form action={handleProfileSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              defaultValue={user.email} 
              disabled 
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-4 py-2 text-gray-500 cursor-not-allowed" 
            />
            <p className="text-xs text-gray-500 mt-1">Contact support to change your email address.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input 
              name="fullName" 
              type="text" 
              defaultValue={user.name || ''} 
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-4 py-2 text-white focus:outline-none focus:border-gray-500" 
            />
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button 
              type="submit" 
              disabled={isSavingProfile}
              className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isSavingProfile ? "Saving..." : "Save Profile"}
            </button>
            {profileSuccess && <span className="text-sm text-green-500">Profile updated successfully!</span>}
          </div>
        </form>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
        <form id="password-form" action={handlePasswordSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
            <input 
              required
              name="currentPassword" 
              type="password" 
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-4 py-2 text-white focus:outline-none focus:border-gray-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
            <input 
              required
              name="newPassword" 
              type="password" 
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-4 py-2 text-white focus:outline-none focus:border-gray-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
            <input 
              required
              name="confirmPassword" 
              type="password" 
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-md px-4 py-2 text-white focus:outline-none focus:border-gray-500" 
            />
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button 
              type="submit" 
              disabled={isSavingPassword}
              className="bg-[#222222] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#333333] border border-[#333333] transition-colors disabled:opacity-50"
            >
              {isSavingPassword ? "Updating..." : "Update Password"}
            </button>
            {passwordSuccess && <span className="text-sm text-green-500">Password changed successfully!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

