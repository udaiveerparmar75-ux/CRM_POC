const express = require('express');
const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const router = express.Router();

// MongoDB Health check
router.get('/api/mongo/health', async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.json({ 
      status: 'success', 
      message: 'MongoDB connection successful',
      totalCustomers: count 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'MongoDB connection failed',
      error: error.message 
    });
  }
});

// Get all customers from MongoDB
router.get('/api/mongo/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json({ 
      status: 'success',
      data: customers 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch customers from MongoDB',
      error: error.message 
    });
  }
});

// Create new customer in MongoDB
router.post('/api/mongo/customers', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const customer = new Customer({ name, email, phone });
    const savedCustomer = await customer.save();
    
    res.status(201).json({ 
      status: 'success',
      message: 'Customer created successfully in MongoDB',
      data: savedCustomer 
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        status: 'error', 
        message: 'Email already exists',
        error: 'Duplicate email address' 
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to create customer in MongoDB',
        error: error.message 
      });
    }
  }
});

// Update customer in MongoDB (PUT - complete replacement)
router.put('/api/mongo/customers/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found in MongoDB'
      });
    }
    
    res.json({ 
      status: 'success',
      message: 'Customer updated successfully in MongoDB',
      data: customer 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to update customer in MongoDB',
      error: error.message 
    });
  }
});

// Partially update customer in MongoDB (PATCH)
router.patch('/api/mongo/customers/:id', async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = ['name', 'email', 'phone'];
    
    // Filter only allowed fields
    const filteredUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        filteredUpdates[key] = value;
      }
    }
    
    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid fields provided for update'
      });
    }
    
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      filteredUpdates,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found in MongoDB'
      });
    }
    
    res.json({ 
      status: 'success',
      message: 'Customer partially updated successfully in MongoDB',
      data: customer,
      updatedFields: Object.keys(filteredUpdates)
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to partially update customer in MongoDB',
      error: error.message 
    });
  }
});

// Delete customer from MongoDB
router.delete('/api/mongo/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found in MongoDB'
      });
    }
    
    res.json({ 
      status: 'success',
      message: 'Customer deleted successfully from MongoDB',
      data: customer 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to delete customer from MongoDB',
      error: error.message 
    });
  }
});

// Get customers created between two dates
router.get('/api/mongo/customers/date-range', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    // Validate required parameters
    if (!from || !to) {
      return res.status(400).json({
        status: 'error',
        message: 'Both from and to date parameters are required',
        example: '/api/mongo/customers/date-range?from=2024-01-01&to=2024-12-31'
      });
    }
    
    // Parse and validate dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format. Please use YYYY-MM-DD format',
        example: '/api/mongo/customers/date-range?from=2024-01-01&to=2024-12-31'
      });
    }
    
    // Ensure from date is not after to date
    if (fromDate > toDate) {
      return res.status(400).json({
        status: 'error',
        message: 'From date cannot be after to date'
      });
    }
    
    // Set time to start and end of day for proper range filtering
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);
    
    // Query customers created between the dates
    const customers = await Customer.find({
      createdAt: {
        $gte: fromDate,
        $lte: toDate
      }
    }).sort({ createdAt: -1 }); // Sort by creation date, newest first
    
    res.json({
      status: 'success',
      message: `Found ${customers.length} customers created between ${from} and ${to}`,
      dateRange: {
        from: fromDate.toISOString(),
        to: toDate.toISOString()
      },
      count: customers.length,
      data: customers
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch customers by date range',
      error: error.message
    });
  }
});

// Create new lead in MongoDB
router.post('/api/mongo/lead', async (req, res) => {
  try {
    const { name, email, phone,leadsource, leadcomments } = req.body;
    console.log(`Received lead data: ${JSON.stringify(req.body)}`);
    const lead = new Lead({  name, email, phone,leadsource, leadcomments, leadprocessed: 'New' });
    const savedLead = await lead.save();
    
    res.status(201).json({ 
      status: 'success',
      message: 'Lead created successfully in MongoDB',
      data: savedLead 
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        status: 'error', 
        message: 'Email already exists',
        error: 'Duplicate email address' 
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to create lead in MongoDB',
        error: error.message 
      });
    }
  }
});

module.exports = router;
