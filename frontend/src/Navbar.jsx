import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleHomeClick = () => {
    if (role === "customer") {
      navigate("/customer");
    } else if (role === "admin") {
      navigate("/admin");
    } else if (role === "staff") {
      navigate("/staff");
    }
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 3 }}>
          {username}
        </Typography>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={handleHomeClick}
        >
          MyShop
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate("/profile")}>
            Profile
          </Button>
          <Button color="inherit" onClick={() => navigate("/track-order")}>
            Track Order
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;