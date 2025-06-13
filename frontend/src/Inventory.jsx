import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>Inventory Management</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/product-list")}
        >
          View Product List
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/order-list")}
        >
          View Order List
        </Button>
        {localStorage.getItem("role") === "admin" && (
          <Button variant="contained" color="info" onClick={() => navigate("/sales-report")}>
            View Sales Report
          </Button>
        )}
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="contained" color="success" onClick={() => navigate("/profile")}>
          Edit Profile
        </Button>
      </Box>
    </Container>
  );
};

export default Inventory;