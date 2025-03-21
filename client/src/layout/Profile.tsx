import  { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { Footer } from "../components/FooterComp";
import { Logout } from "../components/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditProfileForm from "../components/EditProfileForm";
import UploadButton from "../components/UploadProfilePic";
import config from '../config';

// type pour l'utilisateur
interface UserProfile {
  username: string;
  email: string;
  bio: string;
  website: string;
  created_at: string;
  profile_picture: string;
}

interface FollowUser {
  username: string;
  profile_picture?: string;
}

const Profile = () => {
  {/* typage du form pour la structure de l'état (mis à vide => ts) voir au dessus
  const [profile, setProfile] = useState({ 
    username: "",
    email: "",
    bio: "",
    website: "",
    created_at: "",
    profile_picture: "",
  });*/}
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const { user } = useContext(AuthContext) || {};
  const token = user?.token;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // pour le form du profil 
  const [isUploading, setIsUploading] = useState(false); // pour l'upload de la pp 

  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false)

  const [followers, setFollowers] = useState<FollowUser[]>([]); // liste des utilisateurs 
  const [followersCount, setFollowersCount] = useState(0); // count (precook in route) 

  const [followed, setFollowed] = useState<FollowUser[]>([]);
  const [followedCount, setFollowedCount] = useState(0);
  
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowed, setShowFollowed] = useState(false);
  



  {/** premier hook ajoutat les info de l'affichage du profil */}
  useEffect(() => {
    const fetchProfile = async () => {

      try {
        if (!token) {
          setError("Vous devez etre connecté pour voir votre profil.");
          navigate("/login");
          return;
        }

        const response = await axios.post(
          `${config.serverUrl}/user/profile`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData({
          username: response.data.username,
          email: response.data.email,
          bio: response.data.bio || "Aucune bio disponible.",
          website: response.data.website || "",
          created_at: new Date(response.data.created_at).toLocaleDateString(),
          profile_picture: response.data.profile_picture || "default.jpg",
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du profil: ", error);
        setError("Impossible de récupérer les infos du profil.");
      }
    };
    fetchProfile();
  }, [token, navigate]); // dependance du hook pour s'assurer que la requete est bien relancée apres l'effet


  useEffect(() => {
    const fetchFollowers =async () => {
      if (!token || !userData) return;

      try {
        setIsLoadingFollowers(true);

        const followerResponse = await axios.get(`${config.serverUrl}/user/get-follow/${userData.username}`);
        const followedResponse = await axios.get(`${config.serverUrl}/user/get-followed/${userData.username}`);

        setFollowers(followerResponse.data.followers);
        setFollowersCount(followerResponse.data.count);
        setFollowed(followedResponse.data.followed);
        setFollowedCount(followedResponse.data.count);
        console.log("Followers count:", followerResponse.data.count);
        console.log("Followed count:", followedResponse.data.count);
      } catch (error) {
          console.error("Erreur lors de la récupération des abonnés/abonnements", error);
      } finally {
        setIsLoadingFollowers(false);
      }
    };
    fetchFollowers();
  }, [token, userData]); // userData comme dépendance pour s'assurer que les données du profil sont chargées d'abord

  if (error) {
    return (
      <div className="text-white text-center mt-10">
        <p>{error}</p>
        <p>Si vous rencontrez plusieurs erreur à la suite essayez de vous reconnecter</p>
        < Logout />
      </div>
    );
  }

  if (!userData){
    return (
      <div className="text-white text-center mt-10">
        <p>Chargement...</p>
      </div>
    );
  }

  // pop up des listes des abonnés / abonnements
  const FollowersModal = ({ users, title, onClose }: { users: FollowUser[], title: string, onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-xl font-bold">{title}</h3>
            <button onClick={onClose} className="text-xl">×</button>
          </div>
          <div className="p-4">
            {users.length === 0 ? (
              <p className="text-center text-gray-400">Aucun résultat</p>
            ) : (
              users.map((user, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md">
                  <img 
                    src={user.profile_picture ? `${config.serverUrl}/user/profile-picture/${user.profile_picture}` : `${config.serverUrl}/user/profile-picture/default.jpg`}
                    alt={user.username} 
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{user.username}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col md:flex-row min-h-screen bg-black text-white flex-grow ml-[250px]">
      
      {/* page de profil */}
      {isEditing ? (
        <EditProfileForm userData={userData} setIsEditing={setIsEditing} />
      ) : isUploading ? ( 
          <UploadButton 
            userData={userData} 
            setIsUploading={setIsUploading} 
          /> ) : (
        
        <div className="max-w-4xl mx-auto mt-10 p-4">
        <div className="flex items-center space-x-10">

          <img
            src={`${config.serverUrl}/user/profile-picture/${userData.profile_picture}` || `${config.serverUrl}/user/profile-picture/default.jpg`}
            alt="Profile"
            className="w-28 h-28 rounded-full border-2 border-gray-600"
          />

          {/* Infos du profil */}
          <div>
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold">{userData.username}</h2>

              {/* Modifier le profil */}
              <button   
                onClick={() => setIsEditing(true)}
                className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm cursor-pointer">
                Modifier le profil
              </button>
              

              {/* Button d'upload de photo */}
              <button 
                onClick={() => setIsUploading(true)}
                className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm cursor-pointer">
                Changer la photo de profil
              </button> 

              <button className="text-gray-400 text-xl cursor-pointer">⚙️</button>
            </div>

            <div className="flex space-x-6 mt-3 text-gray-300">
              {isLoadingFollowers ? (
                <>
                  <span>
                    <strong>...</strong> posts
                  </span>
                  <span>
                    <strong>...</strong> abonnés
                  </span>
                  <span>
                    <strong>...</strong> abonnements
                  </span>
                </>
              ) : (
                <>
                  <span>
                    <strong>0</strong> posts
                  </span>

                  <span 
                    className="hover:text-white cursor-pointer"
                    onClick={() => setShowFollowers(true)}>
                    <strong>{followersCount}</strong> abonnés
                  </span>

                  <span 
                    className="hover:text-white cursor-pointer"
                    onClick={() => setShowFollowed(true)}>
                    <strong>{followedCount}</strong> abonnements
                  </span>
                </>
              )}
            </div>

            {/* bio affichée*/}
            <p className="mt-2">{userData.bio || "Vous n'avez pas de bio !"}</p>
            <div className="my-4"></div>
            <p className="text-sm">{userData.website || ""}</p>
          </div>
        </div>

        {/* Stories Highlights */}
        <div className="mt-10 flex space-x-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-gray-600 flex items-center justify-center rounded-full">
              <span className="text-2xl">➕</span>
            </div>
            <p className="text-sm mt-2">Nouveau</p>
          </div>
        </div>

        {/* Navigation Posts */}
        <div className="border-t border-gray-700 mt-10 flex justify-center space-x-10 py-2">
          <span className="text-white font-bold p-2 hover:border hover:border-white rounded-lg cursor-pointer">📷 POSTS</span>
          <span className="text-gray-500 p-2 hover:border hover:border-white rounded-lg cursor-pointer">🔖 SAVED</span>
          <span className="text-gray-500 p-2 hover:border hover:border-white rounded-lg cursor-pointer">🏷️ TAGGED</span>
        </div>

        {/* Section Share Photos */}
        <div className="text-center mt-10">
          <h3 className="text-xl font-bold mt-2">Partage tes photos</h3>
          <p className="text-gray-400 mt-2">
            Quand tu partages des photos et vidéos, elles apparaissent sur ton profil.
          </p>
          <button className="text-blue-500 mt-3 cursor-pointer">Partager ta première photo</button>
        </div>
      </div>
      )}

      {showFollowers && (
        <FollowersModal 
          users={followers} 
          title="Abonnés" 
          onClose={() => setShowFollowers(false)} 
        />
      )}
      
      {showFollowed && (
        <FollowersModal 
          users={followed} 
          title="Abonnements" 
          onClose={() => setShowFollowed(false)} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Profile;
