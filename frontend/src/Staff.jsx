import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Container, Typography, Button, Box} from "@mui/material";

const Staff = () => {

const navigate = useNavigate();
const [username, setUsername] = useState("");
const [role, setRole] = useState("");

useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
        setUsername(storedUser); 
        setRole(storedRole); 

        if (storedRole !== "staff") {
            alert("Access denied. Staff only.");
            navigate("/login");
        }
    } else {
        navigate("/login"); 
    }
}, [navigate]); 

return(
    <Container>
        <Box 
        sx= {{
            textAlign: "center",
            p: 3,
            mb: -5,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#f0f0f0",
        }} > </Box>


<Typography variant = "h6" sx = {{ color: "757575" , mb: 10}}>
    This is the dashboard for staff members only.
</Typography>
<Box
sx = {{
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    
    p:11,
    mb:-14,
    borderRadius: 2,
    boxShadow: 5,
    backgroundColor: "f0f0f0",
}}></Box>
        <Typography variant="h3" sx ={{ color: "757575", mb:10}}>
            Welcome {username}</Typography> 
        
        <Box
        sx = {{
            textAlign: "center",
            p: 1,
            mt: 2,
            mb: 5,
            width: 100,
            margin: "0 auto",
            borderRadius: -1,
            boxShadow: 3,
            backgroundColor: "#e8f5e9",
        }}>
            <Button
            variant ="contained"
            sx={{ backgroundColor: "#2196f3",
                color: "white",
               
            }}
            onClick={() => {
                localStorage.removeItem("username");
                localStorage.removeItem("role");
                localStorage.removeItem("token");
                navigate("/login");
            }}
            > 
            Logout
            </Button>
        </Box>
    </Container>
);
};

export default Staff;