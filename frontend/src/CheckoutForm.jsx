import { Container, Typography, TextField, Button, Box, RadioGroup, FormControlLabel, Radio, Paper, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const CheckoutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const singleProduct = location.state?.product;
  const cart = location.state?.cart;
  const [showReceipt, setShowReceipt] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "visa",
  });
  const [orderId, setOrderId] = useState(null);

  // Products to checkout: either single or all from cart
  const products = cart || (singleProduct ? [singleProduct] : []);

  if (!products.length) {
    return (
      <Container>
        <Typography variant="h5">No product selected for checkout.</Typography>
      </Container>
    );
  }

  const total = products.reduce((sum, p) => sum + Number(p.price), 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/orders", {
      customer: localStorage.getItem("username"),
      items: products,
      total,
      address: formData.address,
      phone: formData.phone,
      payment: formData.payment,
    });
    setOrderId(res.data.orderId);
    setShowReceipt(true);
  };

  if (showReceipt) {
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" gutterBottom>Receipt</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography><b>Name:</b> {formData.name}</Typography>
          <Typography><b>Address:</b> {formData.address}</Typography>
          <Typography><b>Phone:</b> {formData.phone}</Typography>
          <Typography><b>Payment Method:</b> {formData.payment}</Typography>
          {orderId && (
            <Typography><b>Tracking ID:</b> {orderId}</Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Products:</Typography>
          {products.map((p, idx) => (
            <Typography key={idx}>
              {p.name} - ${p.price}
            </Typography>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Total: ${total}</Typography>
          <Button sx={{ mt: 2, mr: 2 }} variant="contained" onClick={() => navigate("/customer")}>
            Back to Home
          </Button>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate("/track-order")}>
            Track Order
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Checkout
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2 }}>Products:</Typography>
        {products.map((p, idx) => (
          <Typography key={idx}>{p.name} - ${p.price}</Typography>
        ))}
        <Typography variant="h6" sx={{ mt: 2 }}>Total: ${total}</Typography>
        <TextField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ my: 2 }}
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          required
          sx={{ my: 2 }}
        />
        <TextField
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          required
          sx={{ my: 2 }}
        />
        <Typography sx={{ mt: 2 }}>Payment Method:</Typography>
        <RadioGroup
          name="payment"
          value={formData.payment}
          onChange={handleChange}
          row
        >
          <FormControlLabel value="visa" control={<Radio />} label="Visa" />
          <FormControlLabel value="cod" control={<Radio />} label="COD" />
          <FormControlLabel value="e-bank" control={<Radio />} label="E-Bank" />
        </RadioGroup>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Place Order
        </Button>
      </Box>
    </Container>
  );
};

export default CheckoutForm;