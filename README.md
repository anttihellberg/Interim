# Watch Inventory Manager

A modern web application for managing inventory of a retail store selling mechanical watches. Users can browse products, add new watches, delete existing ones, and update quantities with an intuitive, easy-to-use interface.

## Features

- 📱 **Modern, Responsive UI** - Built with Bootstrap 5 for a clean, professional look
- 🔍 **Browse Products** - View all watches in an elegant card-based grid layout
- ➕ **Add Products** - Easily add new mechanical watches to the inventory
- 🗑️ **Delete Products** - Remove watches from the inventory with confirmation
- 🔢 **Update Quantities** - Adjust stock levels with intuitive increment/decrement buttons
- 📊 **Live Statistics** - View total products, stock count, and inventory value at a glance
- 💾 **Local Database** - SQLite database pre-populated with 20 mechanical watch products

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Interim
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database with sample data:
```bash
npm run init-db
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. The application will display all watches in the inventory. You can:
   - Click **"Add New Watch"** to add products
   - Use **+/-** buttons to adjust quantities
   - Click the **trash icon** to delete products
   - View real-time statistics at the top

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: SQLite3
- **Frontend**: EJS templates, Bootstrap 5, Vanilla JavaScript
- **Icons**: Bootstrap Icons

## Project Structure

```
Interim/
├── server.js           # Express server and API routes
├── initDb.js           # Database initialization script
├── package.json        # Project dependencies
├── views/
│   └── index.ejs       # Main page template
├── public/
│   ├── css/
│   │   └── style.css   # Custom styles
│   └── js/
│       └── app.js      # Client-side JavaScript
└── inventory.db        # SQLite database (generated)
```

## API Endpoints

- `GET /` - Main page
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product
- `PATCH /api/products/:id/quantity` - Update product quantity
- `DELETE /api/products/:id` - Delete product

## License

ISC