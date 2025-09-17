const express = require('express');
const db = require('../config/mysql');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.send('Hello World!');
});

// Health check route
router.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database connection test route
router.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT 1 as test');
    res.json({ 
      status: 'success', 
      message: 'Database connection successful',
      data: rows 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Sample CRM endpoints
router.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM customers');
    res.json({ 
      status: 'success',
      data: rows 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch customers',
      error: error.message 
    });
  }
});

router.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const [result] = await db.execute(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone]
    );
    res.status(201).json({ 
      status: 'success',
      message: 'Customer created successfully',
      customerId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to create customer',
      error: error.message 
    });
  }
});

// Update customer information (complete replacement)
router.put('/api/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const { name, email, phone } = req.body;
    
    // Check if customer exists
    const [existingCustomer] = await db.execute(
      'SELECT id FROM customers WHERE id = ?',
      [customerId]
    );
    
    if (existingCustomer.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }
    
    // Update customer
    const [result] = await db.execute(
      'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, customerId]
    );
    
    res.json({ 
      status: 'success',
      message: 'Customer updated successfully',
      affectedRows: result.affectedRows 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to update customer',
      error: error.message 
    });
  }
});

// Partially update customer information
router.patch('/api/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const updates = req.body;
    
    // Check if customer exists
    const [existingCustomer] = await db.execute(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );
    
    if (existingCustomer.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }
    
    // Build dynamic update query based on provided fields
    const allowedFields = ['name', 'email', 'phone'];
    const updateFields = [];
    const updateValues = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid fields provided for update'
      });
    }
    
    // Add customer ID to the end of values array
    updateValues.push(customerId);
    
    // Execute update query
    const [result] = await db.execute(
      `UPDATE customers SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    res.json({ 
      status: 'success',
      message: 'Customer partially updated successfully',
      affectedRows: result.affectedRows,
      updatedFields: Object.keys(updates).filter(key => allowedFields.includes(key))
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to partially update customer',
      error: error.message 
    });
  }
});

module.exports = router;
