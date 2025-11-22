const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Path to your data.json file
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware to read data.json
const readDataFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data.json", error);
    return [];
  }
};

// Middleware to write to data.json
const writeDataFile = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing data.json", error);
  }
};

// Endpoint to get all products data
app.get('/api/products', (req, res) => {
  const products = readDataFile();
  res.json(products);
});

// Endpoint to get a specific product by ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const products = readDataFile();
  const product = products.find(p => p.id === id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Endpoint to update a product by ID (e.g., dimensions, weight)
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { dimensions, weight } = req.body;

  let products = readDataFile();
  let product = products.find(p => p.id === id);

  if (product) {
    product.dimensions = dimensions || product.dimensions;
    product.weight = weight || product.weight;

    // Save the updated products list to data.json
    writeDataFile(products);

    res.json({ message: 'Product updated successfully', product });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Endpoint to create a new product
app.post('/api/products', (req, res) => {
  const { title, sku, dimensions, weight, image } = req.body;
  const newProduct = {
    id: new Date().getTime().toString(), // Simple unique ID (timestamp-based)
    title,
    sku,
    dimensions,
    weight,
    image,
  };

  const products = readDataFile();
  products.push(newProduct);

  writeDataFile(products);

  res.status(201).json({ message: 'Product created successfully', product: newProduct });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
