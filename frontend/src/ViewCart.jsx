import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const ViewCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

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
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/checkout", { state: { product } })}
                >
                  Buy
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
    </Container>
  );
};

export default ViewCart;