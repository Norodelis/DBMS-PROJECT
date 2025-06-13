import { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, FormControlLabel, Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Please fill in all the fields");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        { username, password, role: "customer" }, // Always register as customer
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
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
          backgroundColor: "#f7f7f8" 
        }}
      >
        <Typography variant="h4" sx={{ color: "#333", mb: 2 }}>
          Register
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
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          sx={{ backgroundColor: "white" }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
          }
          label="Show Password"
          sx={{ mb: 2, ml: -21, mt: -2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
          sx={{ mt: 1, borderRadius: "8px", textTransform: "none" }}
        >
          Register
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => navigate("/login")}
          sx={{ mt: 1, borderRadius: "8px", textTransform: "none" }}
        >
          Go to Login
        </Button>
        <Button
          variant="text"
          color="primary"
          fullWidth
          onClick={() => navigate("/forgot-password")}
          sx={{ mt: 1, textTransform: "none" }}
        >
          Forgot Password?
        </Button>
      </Box>
    </Container>
  );
};

export default Register;

