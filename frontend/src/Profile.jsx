import { Container, Typography, TextField, Button, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const username = localStorage.getItem("username");
  const [form, setForm] = useState({
    name: "",
    address: "",
    password: "",
    newPassword: "",
  });

  useEffect(() => {
    // Fetch user info
    axios.get(`http://localhost:5000/user/${username}`)
      .then(res => {
        setForm(f => ({
          ...f,
          name: res.data.name || "",
          address: res.data.address || ""
        }));
      });
  }, [username]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Update name/address
    await axios.put(`http://localhost:5000/user/${username}`, {
      name: form.name,
      address: form.address
    });
    alert("Profile updated!");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!form.password || !form.newPassword) {
      alert("Please fill in both password fields");
      return;
    }
    await axios.post("http://localhost:5000/forgot-password", {
      username,
      newPassword: form.newPassword,
      currentPassword: form.password
    });
    alert("Password updated!");
    setForm({ ...form, password: "", newPassword: "" });
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>Edit Profile</Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Username: {username} | Role: {localStorage.getItem("role")}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
            Update Info
          </Button>
        </form>
        <form onSubmit={handlePasswordChange}>
          <TextField
            label="Current Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="secondary">
            Change Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;