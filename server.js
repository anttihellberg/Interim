const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Home page - display all products
app.get('/', (req, res) => {
  db.all('SELECT * FROM products ORDER BY brand, name', [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching products');
      return;
    }
    res.render('index', { products: rows });
  });
});

// API: Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY brand, name', [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching products' });
      return;
    }
    res.json(rows);
  });
});

// API: Get single product
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching product' });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(row);
  });
});

// API: Add new product
app.post('/api/products', (req, res) => {
  const { name, brand, description, price, quantity, image_url } = req.body;
  
  if (!name || !brand || !price) {
    res.status(400).json({ error: 'Name, brand, and price are required' });
    return;
  }

  const stmt = db.prepare(`
    INSERT INTO products (name, brand, description, price, quantity, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(name, brand, description || '', price, quantity || 0, image_url || '', function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding product' });
      return;
    }
    res.json({ id: this.lastID, message: 'Product added successfully' });
  });

  stmt.finalize();
});

// API: Update product quantity
app.patch('/api/products/:id/quantity', (req, res) => {
  const { quantity } = req.body;
  
  if (quantity === undefined || quantity < 0) {
    res.status(400).json({ error: 'Valid quantity is required' });
    return;
  }

  db.run('UPDATE products SET quantity = ? WHERE id = ?', [quantity, req.params.id], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating quantity' });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Quantity updated successfully' });
  });
});

// API: Delete product
app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting product' });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
