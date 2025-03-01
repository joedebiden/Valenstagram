import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../components/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ${process.env.api_server_ip}
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {username, password});
      //console.log(response.data.token);
      if (login) {
        login(response.data.token);
        navigate("/");
      } else {
        setError('La fonction de connexion n\'est pas disponible.');
      }

    } catch (error) {
      console.error('Error: ', error);
      setError('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      {/* Conteneur principal */}
      <div className="flex flex-col md:flex-row items-center space-y-10 md:space-y-0 md:space-x-10">
        {/* Section Mobile Mockup */}
        <div className="relative hidden md:block">
          <img
            src="src/assets/iphone-login-pic.jpg" 
            alt="Phone Mockup"
            className="max-w-xs"
          />
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-[220px]">
            <img
              src="src/assets/Likes_Social_pagina.png"
              alt="Instagram feed"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-80 text-white">
          <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>
          <form onSubmit={handleSubmit} >
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
            >
              Se connecter
            </button>
            {error && <p className='text-red-500 mt-3'>{error}</p>}
          </form>
          <div className="text-center my-4">OU</div>
          <button className="w-full flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 rounded">
            <span className="mr-2">🔵</span> Se connecter avec Facebook
          </button>
          <p className="text-center text-sm mt-4">
            Mot de passe oublié ?
          </p>
        </div>
      </div>

      {/* Lien inscription */}
      <div className="mt-4 bg-gray-800 p-4 rounded-lg w-80 text-center text-white">
        Vous n'avez pas de compte ?{" "}
        <a href="/register" className="text-blue-400 hover:underline">
          Inscrivez-vous
        </a>
      </div>
    </div>
  );
};

export default Login;
