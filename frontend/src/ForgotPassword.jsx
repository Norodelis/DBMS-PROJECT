import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!username || !newPassword) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/forgot-password",
        { username, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message || "Password updated successfully");
      navigate("/login"); // Redirect to login page after reset
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          textAlign: "center",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#f7f7f8",
        }}
      >
        <Typography variant="h4" sx={{ color: "#333", mb: 2 }}>
          Forgot Password
        </Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          sx={{ backgroundColor: "white" }}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          variant="outlined"
          sx={{ backgroundColor: "white" }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleForgotPassword}
          sx={{ mt: 2, borderRadius: "8px", textTransform: "none" }}
        >
          Update Password
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => navigate("/login")}
          sx={{ mt: 1, borderRadius: "8px", textTransform: "none" }}
        >
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default ForgotPassword;