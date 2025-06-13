import { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin"); // Default role is "admin"
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const roleFromBackend = response.data.role; // role from backend
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role); // will store the role

      // Validate role
      if (selectedRole !== roleFromBackend) {
        alert("Incorrect role selected. Please try again.");
        return;
      }

      // Navigate based on correct role
      if (roleFromBackend === "admin") {
        navigate("/admin");
      } else if (roleFromBackend === "staff") {
        navigate("/staff");
      } else if (roleFromBackend === "customer") {
        navigate("/customer");
      } else {
        alert("Invalid role");
      }
    } catch (error) {
      alert("Login failed");
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
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h4" sx={{ color: "#333", mb: 2 }}>
          Login
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
              color="primary"
            />
          }
          label="Show Password"
          sx={{ mb: 2, ml: -21, mt: -2 }}
        />
        <FormControl
          fullWidth
          margin="normal"
          sx={{
            mt: 2,
            mb: 2,
          }}
        >
          <InputLabel
            id="role-label"
            sx={{
              mt: -2,
              fontSize: "1.5rem",
            }}
          >
            Select Role
          </InputLabel>
          <Select
            labelId="role-label"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="staff">Staff</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2, borderRadius: "8px", textTransform: "none" }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => navigate("/")}
          sx={{ mt: 1, borderRadius: "10px", textTransform: "none" }}
        >
          Go to Register
        </Button>
      </Box>
      {/* Forgot Password button outside the box */}
      <Button
        variant="text"
        color="primary"
        fullWidth
        onClick={() => navigate("/forgot-password")} // Redirect to Forgot Password page
        sx={{ mt: 2, textTransform: "none" }}
      >
        Forgot Password?
      </Button>
    </Container>
  );
};

export default Login;