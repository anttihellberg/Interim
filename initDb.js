const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      image_url TEXT
    )
  `);

  // Clear existing data
  db.run('DELETE FROM products');

  // Insert 20 mechanical watches
  const watches = [
    {
      name: 'Classic Automatic',
      brand: 'Timeless',
      description: 'Elegant automatic movement with visible balance wheel',
      price: 599.99,
      quantity: 12,
      image_url: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=400&fit=crop'
    },
    {
      name: 'Chronograph Master',
      brand: 'Precision',
      description: 'Swiss-made chronograph with three subdials',
      price: 1299.99,
      quantity: 8,
      image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop'
    },
    {
      name: 'Diver Pro 300',
      brand: 'DeepSea',
      description: 'Professional diving watch, water resistant to 300m',
      price: 899.99,
      quantity: 15,
      image_url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop'
    },
    {
      name: 'Moonphase Elite',
      brand: 'Celestial',
      description: 'Moonphase complication with date display',
      price: 1899.99,
      quantity: 5,
      image_url: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop'
    },
    {
      name: 'Skeleton Vision',
      brand: 'TranspaTime',
      description: 'Open-worked dial showcasing the movement',
      price: 2299.99,
      quantity: 3,
      image_url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400&h=400&fit=crop'
    },
    {
      name: 'Heritage GMT',
      brand: 'WorldTime',
      description: 'Dual time zone with GMT hand',
      price: 1499.99,
      quantity: 10,
      image_url: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=400&fit=crop'
    },
    {
      name: 'Vintage Pilot',
      brand: 'Aviator',
      description: 'Military-inspired pilot watch with large crown',
      price: 799.99,
      quantity: 18,
      image_url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&h=400&fit=crop'
    },
    {
      name: 'Power Reserve XL',
      brand: 'Endurance',
      description: '72-hour power reserve indicator',
      price: 1699.99,
      quantity: 6,
      image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop'
    },
    {
      name: 'Minimalist Auto',
      brand: 'Nordic',
      description: 'Bauhaus-inspired design with clean dial',
      price: 499.99,
      quantity: 22,
      image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'
    },
    {
      name: 'Tourbillon Grand',
      brand: 'Luxury',
      description: 'Mesmerizing tourbillon complication',
      price: 8999.99,
      quantity: 2,
      image_url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop'
    },
    {
      name: 'Regulator Classic',
      brand: 'Timeless',
      description: 'Separated hour, minute, and second hands',
      price: 1199.99,
      quantity: 9,
      image_url: 'https://images.unsplash.com/photo-1585123334904-845d60e97a29?w=400&h=400&fit=crop'
    },
    {
      name: 'Field Master',
      brand: 'Expedition',
      description: 'Rugged field watch with luminous markers',
      price: 649.99,
      quantity: 14,
      image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=400&fit=crop'
    },
    {
      name: 'Racing Chrono',
      brand: 'Speed',
      description: 'Motorsport-inspired chronograph with tachymeter',
      price: 1399.99,
      quantity: 11,
      image_url: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400&h=400&fit=crop'
    },
    {
      name: 'Dress Elegance',
      brand: 'Formal',
      description: 'Ultra-thin dress watch with alligator strap',
      price: 999.99,
      quantity: 7,
      image_url: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=400&fit=crop'
    },
    {
      name: 'Perpetual Calendar',
      brand: 'Celestial',
      description: 'Perpetual calendar with day, date, and month',
      price: 3499.99,
      quantity: 4,
      image_url: 'https://images.unsplash.com/photo-1606390797419-b0c797d7b80b?w=400&h=400&fit=crop'
    },
    {
      name: 'Bronze Diver',
      brand: 'Patina',
      description: 'Bronze case that develops unique patina over time',
      price: 749.99,
      quantity: 13,
      image_url: 'https://images.unsplash.com/photo-1639006570490-79c0c53f1080?w=400&h=400&fit=crop'
    },
    {
      name: 'Day-Date Presidential',
      brand: 'Executive',
      description: 'Day and date display with president bracelet',
      price: 2899.99,
      quantity: 5,
      image_url: 'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400&h=400&fit=crop'
    },
    {
      name: 'Retro Square',
      brand: 'Heritage',
      description: '1970s-inspired square case design',
      price: 549.99,
      quantity: 16,
      image_url: 'https://images.unsplash.com/photo-1611913005679-fa43f85f4671?w=400&h=400&fit=crop'
    },
    {
      name: 'World Timer',
      brand: 'GlobalTime',
      description: 'Display time in all 24 time zones simultaneously',
      price: 1799.99,
      quantity: 8,
      image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop'
    },
    {
      name: 'Complications Master',
      brand: 'Luxury',
      description: 'Multiple complications including minute repeater',
      price: 12999.99,
      quantity: 1,
      image_url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO products (name, brand, description, price, quantity, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  watches.forEach(watch => {
    stmt.run(watch.name, watch.brand, watch.description, watch.price, watch.quantity, watch.image_url);
  });

  stmt.finalize();

  console.log('Database initialized with 20 mechanical watches!');
});

db.close();
