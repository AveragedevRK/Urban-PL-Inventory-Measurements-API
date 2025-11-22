const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Importing the CORS package

const app = express();
const port = process.env.PORT || 3001;

// Middleware to enable CORS
app.use(cors({
  origin: '*', // Allow all origins, or you can specify a particular origin here
  methods: ['GET', 'POST', 'PUT'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Middleware to parse JSON bodies for POST requests
app.use(express.json());

// Endpoint to get all products (GET request)
app.get('/api/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    res.json(products);
  } catch (err) {
    console.error('Failed to read products data:', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// Endpoint to update a product (POST request)
app.post('/api/products', (req, res) => {
  try {
    const newProduct = req.body;
    
    // Read the existing products
    const products = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    
    // Append the new product to the products array
    products.push(newProduct);
    
    // Write the updated products array back to data.json
    fs.writeFileSync('./data.json', JSON.stringify(products, null, 2));

    res.status(201).json({ message: 'Product added successfully!' });
  } catch (err) {
    console.error('Failed to add product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Endpoint to update product dimensions or weight (PUT request)
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;

    // Read the existing products
    const products = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

    // Find the product by ID and update it
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[productIndex] = { ...products[productIndex], ...updatedProduct };

    // Write the updated products array back to data.json
    fs.writeFileSync('./data.json', JSON.stringify(products, null, 2));

    res.status(200).json({ message: 'Product updated successfully!' });
  } catch (err) {
    console.error('Failed to update product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
