import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", image: "", quantity: "" });
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleQuantityChange = (id, value) => {
    setProducts(products.map(p => p.id === id ? { ...p, quantity: value } : p));
  };

  const handleUpdate = async (id) => {
    const product = products.find(p => p.id === id);
    await fetch(`http://localhost:5000/products/${id}/quantity`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: product.quantity }),
    });
    alert("Quantity updated!");
  };

  const handleEdit = (id) => {
    // Implement edit logic
    alert("Edit product ID: " + id);
  };

  const handleRemove = (id) => {
    // Implement remove logic
    alert("Removed product ID: " + id);
  };

  // Add Product Handlers
  const handleAddProduct = async () => {
    await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    setOpen(false);
    setNewProduct({ name: "", description: "", price: "", image: "", quantity: "" });
    // Refresh product list
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 2 }}>Product List</Typography>
      {role === "admin" && (
        <Button variant="contained" color="success" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
          Add Product
        </Button>
      )}
      {/* Add Product Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth sx={{ mb: 2 }} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
          <TextField label="Description" fullWidth sx={{ mb: 2 }} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
          <TextField label="Price" type="number" fullWidth sx={{ mb: 2 }} value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
          <TextField label="Image Path" fullWidth sx={{ mb: 2 }} value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
          <TextField label="Quantity" type="number" fullWidth sx={{ mb: 2 }} value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProduct} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Price</TableCell>
            {role === "admin" && <TableCell>Edit</TableCell>}
            <TableCell>Update</TableCell>
            {role === "admin" && <TableCell>Remove</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={product.quantity || 0}
                  onChange={e => handleQuantityChange(product.id, e.target.value)}
                  size="small"
                  inputProps={{ min: 0 }}
                  disabled={role !== "admin" && role !== "staff"}
                />
              </TableCell>
              <TableCell>${product.price}</TableCell>
              {role === "admin" && (
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(product.id)}>Edit</Button>
                </TableCell>
              )}
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdate(product.id)}
                  disabled={role !== "admin" && role !== "staff"}
                >
                  Update
                </Button>
              </TableCell>
              {role === "admin" && (
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleRemove(product.id)}>
                    Remove
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

export default ProductList;