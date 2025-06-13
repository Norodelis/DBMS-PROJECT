import { Container, Typography, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const ViewFavorites = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Ensure only unique products in favorites (by id)
  const initialFavorites = (location.state?.favorites || JSON.parse(localStorage.getItem("favorites")) || []);
  const [favorites, setFavorites] = useState(
    initialFavorites.filter(
      (fav, idx, arr) => arr.findIndex(f => f.id === fav.id) === idx
    )
  );
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  // Remove product from favorites
  const handleRemove = (indexToRemove) => {
    const updatedFavorites = favorites.filter((_, idx) => idx !== indexToRemove);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Add to cart (only if not already in cart up to stock)
  const handleAddToCart = (product) => {
    const countInCart = cart.filter((p) => p.id === product.id).length;
    if (countInCart >= product.quantity) {
      alert("Cannot add more than available stock!");
      return;
    }
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    alert("Added to cart!");
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Your Favorites
      </Typography>
      <Grid container spacing={3}>
        {favorites.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
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
                  color="primary"
                  sx={{ mt: 2, mr: 1 }}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
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

export default ViewFavorites;