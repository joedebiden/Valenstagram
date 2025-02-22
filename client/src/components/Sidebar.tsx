import React from "react";
import { NavLink } from "react-router-dom";


export const Sidebar: React.FC = () => {

  return (
    <div className="w-[250px] h-screen bg-black text-white p-4 fixed left-0">
      <h1 className="text-2xl font-bold mb-6">Valenstagram</h1>
      <ul className="space-y-4">
        <li>
        <NavLink to="/" className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
          <span role="img" aria-label="home">🏠</span> <span>Home</span>
          </NavLink>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
          <span role="img" aria-label="search">🔍</span> <span>Search</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
          <span role="img" aria-label="search">🧭</span> <span>Explorer</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
          <span role="img" aria-label="search">▶️</span> <span>Reels</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
          <span role="img" aria-label="search">📩</span> <span>Messages</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
          <span role="img" aria-label="notifications">❤️</span> <span>Notifications</span>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
          <span role="img" aria-label="notifications">➕</span> <span>Create</span>
        </li>
        <li>
        <NavLink to="/profile" className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
          <span role="img" aria-label="profile">👤</span> <span>Profile</span>
          </NavLink>
        </li>
        <li className="flex items-center space-x-3 p-2 hover:border hover:border-white rounded-lg cursor-pointer">
          <span role="img" aria-label="profile">⚙️</span> <span>Settings</span>
        </li>
      </ul>
    </div>
  );
};
