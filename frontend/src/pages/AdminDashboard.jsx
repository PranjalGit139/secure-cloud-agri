import React, { useEffect, useState } from "react";
import axios from "axios";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        const response = await axios.get(
          "http://localhost:5000/api/data/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch files for selected user
  const handleUserClick = async (username) => {
    setSelectedUser(username);
    setFiles([]);
    setLoadingFiles(true);
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      const response = await axios.get(
        `http://localhost:5000/api/data/user/${username}/files`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFiles(response.data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Delete a file
  const handleDeleteFile = async (fileKey) => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      await axios.delete("http://localhost:5000/api/data/file", {
        headers: { Authorization: `Bearer ${token}` },
        data: { key: fileKey },
      });

      setFiles(files.filter((file) => file.key !== fileKey));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  // Delete a user
  const handleDeleteUser = async (username) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      await axios.delete(`http://localhost:5000/api/data/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user.username !== username));
      if (selectedUser === username) setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "orange",
            color: "white",
            border: "none",
            padding: "5px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Users List */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Users</h3>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users.map((user) => (
              <li
                key={user.username}
                style={{
                  margin: "8px 0",
                  cursor: "pointer",
                  color: selectedUser === user.username ? "blue" : "black",
                  textDecoration:
                    selectedUser === user.username ? "underline" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span onClick={() => handleUserClick(user.username)}>
                  {user.name} ({user.email}) - {user.groups}
                </span>
                <button
                  onClick={() => handleDeleteUser(user.username)}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete User
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* User Files */}
      {selectedUser && (
        <div>
          <h3>Files of {selectedUser}</h3>
          {loadingFiles ? (
            <p>Loading files...</p>
          ) : files.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {files.map((file) => (
                <li
                  key={file.key}
                  style={{
                    margin: "5px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.key.split("/").pop()}
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.key)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
