import { Container, Typography, TextField, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState, useEffect } from "react";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  // For customer: auto-load their orders
  useEffect(() => {
    if (role === "customer") {
      const fetchOrders = () => {
        fetch(`http://localhost:5000/orders/user/${username}`)
          .then(res => res.json())
          .then(data => setOrders(data));
      };
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [role, username]);

  // For admin: search by order ID
  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    const res = await fetch(`http://localhost:5000/orders/id/${orderId}`);
    const data = await res.json();
    setOrders(data);
    if (data.length === 0) setStatus("Order not found.");
    else setStatus("");
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>Track Order</Typography>
        {role === "admin" && (
          <form onSubmit={handleTrack} style={{ marginBottom: 16 }}>
            <TextField
              label="Tracking ID"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Track
            </Button>
          </form>
        )}
        {status && <Typography color="error">{status}</Typography>}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tracking ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  {JSON.parse(order.items).map((item, idx) => (
                    <div key={idx}>{item.name} x{item.quantity || 1}</div>
                  ))}
                </TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {role === "customer" && orders.length === 0 && (
          <Typography sx={{ mt: 2 }}>You have no orders yet.</Typography>
        )}
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Paper>
    </Container>
  );
};

export default TrackOrder;