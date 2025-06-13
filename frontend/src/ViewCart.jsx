import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const ViewCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Try navigation state, fallback to localStorage
  const [cart, setCart] = useState(location.state?.cart || JSON.parse(localStorage.getItem("cart")) || []);

  // Remove product from cart
  const handleRemove = (indexToRemove) => {
    const updatedCart = cart.filter((_, idx) => idx !== indexToRemove);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Your Cart
      </Typography>
      <Grid container spacing={3}>
        {cart.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  ${product.price}
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  sx={{ mt: 2, mr: 1 }}
                  onClick={() => navigate("/checkout", { state: { product } })}
                >
                  Buy
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {cart.length > 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/checkout", { state: { cart } })}
          >
            Buy All
          </Button>
        </Box>
      )}
      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => window.history.back()}
      >
        Go Back
      </Button>
    </Container>
  );
};

export default ViewCart;