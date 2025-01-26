import React, { useState } from "react";
import { FiSettings, FiUser, FiCode, FiShield, FiBell, FiLock, FiDatabase } from "react-icons/fi";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const tabs = [
    { id: 0, name: "Account Settings", icon: <FiUser /> },
    { id: 1, name: "QR Preferences", icon: <FiCode /> },
    { id: 2, name: "Integrations", icon: <FiDatabase /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiSettings className="text-blue-600" />
            System Settings
          </h1>
          <p className="text-gray-500 mt-2">Manage your account preferences and QR code configurations</p>
        </div>

        {/* Tabs Navigation */}
        <div className="grid grid-cols-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 p-6 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Account Settings */}
          {activeTab === 0 && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <FiUser /> Profile Information
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@university.edu"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <FiShield /> Security
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        twoFactor ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {twoFactor ? "Enabled" : "Enable"}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-gray-500">Last changed 3 days ago</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Preferences */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <FiLock /> Design Customization
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Color</label>
                    <input
                      type="color"
                      className="w-full h-12 rounded-lg cursor-pointer"
                      defaultValue="#2563eb"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light Theme</option>
                      <option value="dark">Dark Theme</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <FiLock /> Expiration Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      className="w-24 p-3 border rounded-lg"
                      placeholder="30"
                    />
                    <span className="text-gray-600">Minutes until QR code expires</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      className="w-24 p-3 border rounded-lg"
                      placeholder="5"
                    />
                    <span className="text-gray-600">Maximum allowed scans per code</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <FiDatabase /> LMS Integration
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Google Classroom</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      Connect Account
                    </button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Moodle Integration</h3>
                    <input
                      type="text"
                      placeholder="API Key"
                      className="w-full p-3 border rounded-lg mb-3"
                    />
                    <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <FiBell /> Notifications
                </h2>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive attendance summary reports</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      notifications ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {notifications ? "Enabled" : "Disable"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
          <button className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            Cancel
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FiLock className="text-lg" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;