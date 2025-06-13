const express = require("express");
const mysql2 = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());


const db = mysql2.createPool(
  {
      host:"localhost",
      user:"root",
      password:"",
      database:"user_db",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
  });

  db.getConnection(
    (err) =>{
      if(err){
        console.log("Database connection failed", err);
      }
      else{
        console.log("Connected to MySQL Database");
      }
    } 
  );

  //REGISTER
  
  app.post("/register", async (req, res) => {
    const { username, password, role } = req.body;

    console.log ("Received Payload:", {username, password, role}); 

    if (!username || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    db.query("INSERT INTO userss (username, password, role) VALUES (?, ?, ?)", [username, hashedPassword, role], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });

  //LOGIN USER
  app.post("/login", (req, res) =>{
    const {username, password} = req.body;

    if (!username || !password){
      return res.status(400).json({ message:"All fields are required"});
    }

    const sql = "SELECT * FROM userss WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
      if(err || results.length === 0){
        return res.status(400).json({message:"Invalid username or password"});
      }


      
      
      const isMatch = await bcrypt.compare(password, results[0].password);

      if(!isMatch){
        return res.status(400).json({message: "Invalid username or password"});
      }

      const token = jwt.sign({ id: results[0].id, username: results[0].username}, process.env.JWT_SECRET, { expiresIn:"1h"});
      res.json({message:"Login successul", token, username: results[0].username, role: results[0].role});
    });
  }); 

  //FORGOT PASSWORD
  app.post("/forgot-password", async (req, res) => {
    const { username, newPassword, currentPassword } = req.body;
    if (!username || !newPassword) {
      return res.status(400).json({ message: "Username and new password are required" });
    }
    db.query("SELECT password FROM userss WHERE username = ?", [username], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      // If currentPassword is provided, check it
      if (currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, results[0].password);
        if (!isMatch) {
          return res.status(400).json({ message: "Current password is incorrect" });
        }
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query("UPDATE userss SET password = ? WHERE username = ?", [hashedPassword, username], (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json({ message: "Password updated successfully" });
      });
    });
  });
  //products
  app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(results);
    });
  });

  app.put("/products/:id/quantity", (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    db.query("UPDATE products SET quantity = ? WHERE id = ?", [quantity, id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "Quantity updated" });
    });
  });
  app.post("/products", (req, res) => {
    const { name, description, price, image, quantity } = req.body;
    db.query(
      "INSERT INTO products (name, description, price, image, quantity) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, image, quantity],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Product added", productId: result.insertId });
      }
    );
  });
//DESCRIBE USERS
  app.get("/describe-userss", (req, res) => {
    db.query("DESCRIBE userss", (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  });
  app.post("/orders", (req, res) => {
    const { customer, items, total, address, phone, payment } = req.body;
    // Insert order
    db.query(
      "INSERT INTO orders (customer, items, total, address, phone, payment) VALUES (?, ?, ?, ?, ?, ?)",
      [customer, JSON.stringify(items), total, address, phone, payment],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });

        // Deduct quantity for each product
        items.forEach(item => {
          db.query(
            "UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?",
            [item.quantity ? item.quantity : 1, item.id, item.quantity ? item.quantity : 1]
          );
        });

        res.json({ message: "Order placed", orderId: result.insertId });
      }
    );
  });
  app.get("/orders", (req, res) => {
    db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(results);
    });
  });
  app.get("/orders/:customer", (req, res) => {
    db.query("SELECT * FROM orders WHERE customer = ? ORDER BY created_at DESC", [req.params.customer], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(results);
    });
  });
  app.get("/sales-report", (req, res) => {
    db.query("SELECT items FROM orders", (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      let totalSales = 0;
      let totalQuantity = 0;
      let productMap = {}; // { productName: { quantity, sales } }

      results.forEach(row => {
        const items = JSON.parse(row.items);
        items.forEach(item => {
          const qty = item.quantity ? item.quantity : 1;
          const sales = Number(item.price) * qty;
          totalSales += sales;
          totalQuantity += qty;
          if (!productMap[item.name]) {
            productMap[item.name] = { quantity: 0, sales: 0 };
          }
          productMap[item.name].quantity += qty;
          productMap[item.name].sales += sales;
        });
      });

      // Get total order count
      db.query("SELECT COUNT(*) as orderCount FROM orders", (err2, results2) => {
        if (err2) return res.status(500).json({ message: "Database error" });
        res.json({
          totalSales,
          totalQuantity,
          orderCount: results2[0].orderCount,
          products: Object.entries(productMap).map(([name, data]) => ({
            name,
            quantity: data.quantity,
            sales: data.sales
          }))
        });
      });
    });
  });
  app.get("/orders/user/:username", (req, res) => {
    db.query(
      "SELECT * FROM orders WHERE customer = ? ORDER BY created_at DESC",
      [req.params.username],
      (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
      }
    );
  });
  app.get("/orders/id/:orderId", (req, res) => {
    db.query(
      "SELECT * FROM orders WHERE id = ?",
      [req.params.orderId],
      (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
      }
    );
  });
// Get user info
app.get("/user/:username", (req, res) => {
  db.query("SELECT name, address FROM userss WHERE username = ?", [req.params.username], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});
// Update user info
app.put("/user/:username", (req, res) => {
  const { name, address } = req.body;
  db.query("UPDATE userss SET name = ?, address = ? WHERE username = ?", [name, address, req.params.username], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Profile updated" });
  });
});
  app.listen(5000, ()=>{
    console.log("Server running on Port 5000")
  });

