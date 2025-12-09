const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./watches.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the watches database.');
    initializeDatabase();
  }
});

// Initialize database with schema
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS watches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      movement TEXT NOT NULL,
      caseMaterial TEXT NOT NULL,
      dialColor TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      description TEXT,
      imageUrl TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Watches table ready.');
      checkAndPopulateDatabase();
    }
  });
}

// Populate database with 20 sample mechanical watches
function checkAndPopulateDatabase() {
  db.get('SELECT COUNT(*) as count FROM watches', (err, row) => {
    if (err) {
      console.error('Error checking database:', err.message);
    } else if (row.count === 0) {
      console.log('Populating database with sample watches...');
      const sampleWatches = [
        { brand: 'Rolex', model: 'Submariner', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Black', price: 8950, quantity: 3, description: 'Iconic dive watch with 300m water resistance', imageUrl: 'https://via.placeholder.com/200x200?text=Submariner' },
        { brand: 'Omega', model: 'Speedmaster Professional', movement: 'Manual', caseMaterial: 'Stainless Steel', dialColor: 'Black', price: 6500, quantity: 5, description: 'The Moonwatch - legendary chronograph', imageUrl: 'https://via.placeholder.com/200x200?text=Speedmaster' },
        { brand: 'Seiko', model: 'SKX007', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Black', price: 275, quantity: 12, description: 'Classic diver\'s watch with proven reliability', imageUrl: 'https://via.placeholder.com/200x200?text=SKX007' },
        { brand: 'TAG Heuer', model: 'Carrera', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Silver', price: 4200, quantity: 4, description: 'Racing-inspired chronograph', imageUrl: 'https://via.placeholder.com/200x200?text=Carrera' },
        { brand: 'Patek Philippe', model: 'Calatrava', movement: 'Manual', caseMaterial: 'White Gold', dialColor: 'White', price: 28000, quantity: 1, description: 'Timeless dress watch excellence', imageUrl: 'https://via.placeholder.com/200x200?text=Calatrava' },
        { brand: 'IWC', model: 'Pilot\'s Watch Mark XVIII', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Black', price: 4800, quantity: 6, description: 'Classic aviation watch design', imageUrl: 'https://via.placeholder.com/200x200?text=Mark+XVIII' },
        { brand: 'Breitling', model: 'Navitimer', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Blue', price: 7900, quantity: 3, description: 'Iconic pilot chronograph with slide rule', imageUrl: 'https://via.placeholder.com/200x200?text=Navitimer' },
        { brand: 'Longines', model: 'Master Collection', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'White', price: 2100, quantity: 8, description: 'Elegant dress watch with moon phase', imageUrl: 'https://via.placeholder.com/200x200?text=Master' },
        { brand: 'Tudor', model: 'Black Bay', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Black', price: 3700, quantity: 7, description: 'Heritage dive watch with vintage styling', imageUrl: 'https://via.placeholder.com/200x200?text=Black+Bay' },
        { brand: 'Cartier', model: 'Tank Louis', movement: 'Manual', caseMaterial: 'Yellow Gold', dialColor: 'Silver', price: 14500, quantity: 2, description: 'Art Deco inspired rectangular case', imageUrl: 'https://via.placeholder.com/200x200?text=Tank' },
        { brand: 'Jaeger-LeCoultre', model: 'Reverso', movement: 'Manual', caseMaterial: 'Stainless Steel', dialColor: 'Silver', price: 6800, quantity: 4, description: 'Reversible case design classic', imageUrl: 'https://via.placeholder.com/200x200?text=Reverso' },
        { brand: 'Zenith', model: 'El Primero', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Silver', price: 7200, quantity: 3, description: 'High-frequency chronograph movement', imageUrl: 'https://via.placeholder.com/200x200?text=El+Primero' },
        { brand: 'Grand Seiko', model: 'SBGH267', movement: 'Automatic', caseMaterial: 'Titanium', dialColor: 'Blue', price: 6200, quantity: 5, description: 'Japanese precision and finishing', imageUrl: 'https://via.placeholder.com/200x200?text=Grand+Seiko' },
        { brand: 'Panerai', model: 'Luminor Marina', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Black', price: 7600, quantity: 4, description: 'Distinctive Italian design with crown guard', imageUrl: 'https://via.placeholder.com/200x200?text=Luminor' },
        { brand: 'A. Lange & Söhne', model: 'Saxonia', movement: 'Manual', caseMaterial: 'White Gold', dialColor: 'Silver', price: 21000, quantity: 1, description: 'German haute horlogerie', imageUrl: 'https://via.placeholder.com/200x200?text=Saxonia' },
        { brand: 'Nomos', model: 'Tangente', movement: 'Manual', caseMaterial: 'Stainless Steel', dialColor: 'White', price: 1800, quantity: 10, description: 'Bauhaus-inspired minimalist design', imageUrl: 'https://via.placeholder.com/200x200?text=Tangente' },
        { brand: 'Vacheron Constantin', model: 'Patrimony', movement: 'Automatic', caseMaterial: 'Rose Gold', dialColor: 'White', price: 26500, quantity: 1, description: 'Ultra-thin dress watch elegance', imageUrl: 'https://via.placeholder.com/200x200?text=Patrimony' },
        { brand: 'Audemars Piguet', model: 'Royal Oak', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Blue', price: 19800, quantity: 2, description: 'Iconic luxury sports watch', imageUrl: 'https://via.placeholder.com/200x200?text=Royal+Oak' },
        { brand: 'Oris', model: 'Aquis', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Green', price: 2100, quantity: 9, description: 'Swiss made dive watch value', imageUrl: 'https://via.placeholder.com/200x200?text=Aquis' },
        { brand: 'Hamilton', model: 'Khaki Field', movement: 'Automatic', caseMaterial: 'Stainless Steel', dialColor: 'Black', price: 595, quantity: 15, description: 'Military-inspired field watch', imageUrl: 'https://via.placeholder.com/200x200?text=Khaki+Field' }
      ];

      const stmt = db.prepare(`
        INSERT INTO watches (brand, model, movement, caseMaterial, dialColor, price, quantity, description, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      sampleWatches.forEach(watch => {
        stmt.run(watch.brand, watch.model, watch.movement, watch.caseMaterial, 
                watch.dialColor, watch.price, watch.quantity, watch.description, watch.imageUrl);
      });

      stmt.finalize(() => {
        console.log('Database populated with 20 sample mechanical watches.');
      });
    }
  });
}

// API Routes

// Get all watches
app.get('/api/watches', (req, res) => {
  db.all('SELECT * FROM watches ORDER BY brand, model', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get a single watch
app.get('/api/watches/:id', (req, res) => {
  db.get('SELECT * FROM watches WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Watch not found' });
    }
  });
});

// Add a new watch
app.post('/api/watches', (req, res) => {
  const { brand, model, movement, caseMaterial, dialColor, price, quantity, description, imageUrl } = req.body;
  
  if (!brand || !model || !movement || !caseMaterial || !dialColor || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO watches (brand, model, movement, caseMaterial, dialColor, price, quantity, description, imageUrl)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [brand, model, movement, caseMaterial, dialColor, price, quantity, description || '', imageUrl || 'https://via.placeholder.com/200x200?text=Watch'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, brand, model, movement, caseMaterial, dialColor, price, quantity, description, imageUrl });
      }
    }
  );
});

// Update watch quantity
app.put('/api/watches/:id/quantity', (req, res) => {
  const { quantity } = req.body;
  
  if (quantity === undefined || quantity < 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  db.run(
    'UPDATE watches SET quantity = ? WHERE id = ?',
    [quantity, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Watch not found' });
      } else {
        res.json({ success: true, quantity });
      }
    }
  );
});

// Update entire watch
app.put('/api/watches/:id', (req, res) => {
  const { brand, model, movement, caseMaterial, dialColor, price, quantity, description, imageUrl } = req.body;
  
  if (!brand || !model || !movement || !caseMaterial || !dialColor || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `UPDATE watches SET brand = ?, model = ?, movement = ?, caseMaterial = ?, dialColor = ?, 
     price = ?, quantity = ?, description = ?, imageUrl = ? WHERE id = ?`,
    [brand, model, movement, caseMaterial, dialColor, price, quantity, description, imageUrl, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Watch not found' });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Delete a watch
app.delete('/api/watches/:id', (req, res) => {
  db.run('DELETE FROM watches WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Watch not found' });
    } else {
      res.json({ success: true });
    }
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
