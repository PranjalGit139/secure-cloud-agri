import React, { useEffect, useState } from "react";
import axios from "axios";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        const res = await axios.get(
          "https://secure-cloud-agri.onrender.com/api/data/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (username) => {
    setSelectedUser(username);
    setFiles([]);
    setLoadingFiles(true);
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      const res = await axios.get(
        `https://secure-cloud-agri.onrender.com/api/data/user/${username}/files`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFiles(res.data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDeleteFile = async (fileKey) => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      await axios.delete("https://secure-cloud-agri.onrender.com/api/data/file", {
        headers: { Authorization: `Bearer ${token}` },
        data: { key: fileKey },
      });

      setFiles(files.filter((file) => file.key !== fileKey));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleDeleteUser = async (username) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      await axios.delete(
        `https://secure-cloud-agri.onrender.com/api/data/user/${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.filter((u) => u.username !== username));
      if (selectedUser === username) setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleLogout = async () => {
    await Auth.signOut();
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 p-10"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-extrabold text-green-700 tracking-tight"
        >
          Admin Dashboard
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg font-semibold"
        >
          Logout
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Users Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/80 shadow-xl rounded-2xl p-6 border border-green-300"
        >
          <h3 className="text-2xl font-semibold text-green-800 mb-4">👥 Registered Users</h3>

          {loadingUsers ? (
            <p className="text-gray-600 animate-pulse">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto space-y-2">
              <AnimatePresence>
                {users.map((user) => (
                  <motion.li
                    key={user.username}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    whileHover={{ scale: 1.03 }}
                    className="flex justify-between items-center bg-white shadow-sm hover:shadow-md transition rounded-lg p-3 cursor-pointer"
                  >
                    <span
                      onClick={() => handleUserClick(user.username)}
                      className={`${
                        selectedUser === user.username
                          ? "text-green-600 font-bold"
                          : "text-gray-800"
                      }`}
                    >
                      {user.name} ({user.email})
                      <span className="block text-xs text-gray-500">{user.groups}</span>
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteUser(user.username)}
                      className="px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded-md text-sm"
                    >
                      Delete
                    </motion.button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>

        {/* Files Section */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              key={selectedUser}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="backdrop-blur-lg bg-white/80 shadow-xl rounded-2xl p-6 border border-blue-300"
            >
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                📁 Files of <span className="text-blue-600">{selectedUser}</span>
              </h3>

              {loadingFiles ? (
                <p className="text-gray-600 animate-pulse">Loading files...</p>
              ) : files.length === 0 ? (
                <p className="text-gray-600">No files uploaded.</p>
              ) : (
                <ul className="max-h-96 overflow-y-auto space-y-2">
                  {files.map((file) => (
                    <motion.li
                      key={file.key}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center bg-white shadow-sm hover:shadow-md transition rounded-lg p-3"
                    >
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {file.key.split("/").pop()}
                      </a>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteFile(file.key)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                      >
                        Delete
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
