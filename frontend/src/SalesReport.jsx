import { useEffect, useState, useRef } from "react";
import { Container, Typography, Paper, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const SalesReport = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [products, setProducts] = useState([]);
  const reportRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      const res = await fetch("http://localhost:5000/sales-report");
      const data = await res.json();
      setTotalSales(data.totalSales);
      setTotalQuantity(data.totalQuantity);
      setOrderCount(data.orderCount);
      setProducts(data.products || []);
    };
    fetchReport();
    const interval = setInterval(fetchReport, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePrint = () => {
    const printContents = reportRef.current.innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`<html><head><title>Sales Report</title></head><body>${printContents}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 4 }} ref={reportRef}>
        <Typography variant="h5" gutterBottom>Sales Report (Real Time)</Typography>
        <Typography variant="h6">Total Sales: ${totalSales}</Typography>
        <Typography variant="h6">Total Orders: {orderCount}</Typography>
        <Typography variant="h6">Total Quantity Sold: {totalQuantity}</Typography>
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Products Sold:</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Product Name</b></TableCell>
              <TableCell><b>Quantity Sold</b></TableCell>
              <TableCell><b>Sales</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod, idx) => (
              <TableRow key={idx}>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.quantity}</TableCell>
                <TableCell>${prod.sales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handlePrint}>
        Print Report
      </Button>
      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
        onClick={() => window.history.back()}
      >
        Go Back
      </Button>
    </Container>
  );
};

export default SalesReport;