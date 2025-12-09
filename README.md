# ⌚ Mechanical Watch Inventory Management System

A modern web application for managing inventory of luxury mechanical watches in a retail store. Built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

- 📋 **Browse Products**: View all mechanical watches in an elegant card-based layout
- ➕ **Add Products**: Add new watches with detailed specifications (brand, model, movement type, case material, dial color, price, quantity)
- ✏️ **Edit Products**: Update watch information and specifications
- ❌ **Delete Products**: Remove watches from inventory
- 🔢 **Quantity Management**: Quickly update stock quantities
- 🔍 **Search**: Filter watches by brand, model, movement, materials, and more
- 📊 **Statistics**: Track total watches, stock count, and inventory value
- 🎨 **Modern UI**: Clean, responsive design with smooth animations

## Pre-populated Database

The application comes with a test database containing 20 luxury mechanical watches from renowned brands including:
- Rolex, Omega, Seiko, TAG Heuer
- Patek Philippe, IWC, Breitling, Longines
- Tudor, Cartier, Jaeger-LeCoultre, Zenith
- Grand Seiko, Panerai, A. Lange & Söhne, Nomos
- Vacheron Constantin, Audemars Piguet, Oris, Hamilton

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

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful architecture

## API Endpoints

- `GET /api/watches` - Get all watches
- `GET /api/watches/:id` - Get a specific watch
- `POST /api/watches` - Add a new watch
- `PUT /api/watches/:id` - Update a watch
- `PUT /api/watches/:id/quantity` - Update watch quantity
- `DELETE /api/watches/:id` - Delete a watch

## Database Schema

Each watch entry contains:
- **id**: Unique identifier
- **brand**: Watch manufacturer
- **model**: Model name
- **movement**: Movement type (Automatic/Manual/Spring Drive)
- **caseMaterial**: Case material (Stainless Steel, Gold, Titanium, etc.)
- **dialColor**: Dial color
- **price**: Price in USD
- **quantity**: Available stock
- **description**: Product description
- **imageUrl**: Product image URL

## Project Structure

```
Interim/
├── server.js           # Express server and API routes
├── package.json        # Project dependencies
├── watches.db          # SQLite database (auto-generated)
├── public/
│   ├── index.html     # Main HTML file
│   ├── styles.css     # CSS styling
│   └── app.js         # Frontend JavaScript
└── README.md          # This file
```

## Usage

### Adding a Watch
1. Click the "+ Add New Watch" button
2. Fill in the watch details (all required fields marked with *)
3. Click "Save Watch"

### Editing a Watch
1. Click the "Edit" button on any watch card
2. Modify the details in the modal
3. Click "Save Watch"

### Updating Quantity
1. Change the quantity value in the stock field
2. Click the "Update" button

### Deleting a Watch
1. Click the "Delete" button on any watch card
2. Confirm the deletion

### Searching
Type in the search box to filter watches by brand, model, movement, materials, or description.

## License

ISC