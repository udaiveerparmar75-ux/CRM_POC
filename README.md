Overview

This project is a backend implementation for a Customer Relationship Management (CRM) Proof of Concept (POC). It provides RESTful APIs for managing customer data stored in both MySQL and MongoDB databases. The application is built using Node.js, Express.js, Mongoose, and MySQL2.


Project Structure
The project follows a modular structure for better maintainability and scalability. Below is the directory structure with explanations:


CRM_POC/
├── config/               # Configuration files for database connections
│   ├── database.js       # MySQL database connection pool
│   └── mongodb.js        # MongoDB connection setup
├── database/             # SQL schema for MySQL database
│   └── schema.sql        # MySQL schema and sample data
├── models/               # Mongoose models for MongoDB
│   └── Customer.js       # MongoDB schema for customers
├── routes/               # API route handlers
│   ├── index.js          # Routes for MySQL-based APIs
│   └── mongodb.js        # Routes for MongoDB-based APIs
├── server.js             # Main entry point of the application
├── package.json          # Project metadata and dependencies
├── README.md             # Project description


Component Responsibilities

1. server.js
    Entry point of the application.
    Sets up the Express server.
    Connects to MongoDB using mongodb.js.
    Registers middleware for JSON and URL-encoded data parsing.
    Mounts route handlers from index.js (MySQL APIs) and mongodb.js (MongoDB APIs).
2. database.js
    Configures a MySQL connection pool using mysql2.
    Exports a promise-based pool for executing SQL queries.
3. mongodb.js
    Establishes a connection to the MongoDB database using mongoose.
    Logs connection success or failure.
4. schema.sql
    Contains the SQL schema for the customers table in MySQL.
    Includes sample data for testing.
5. Customer.js
    Defines the MongoDB schema for customers using mongoose.
    Includes fields: name, email, phone, createdAt, and updatedAt. 
6. index.js       
    Implements RESTful APIs for managing customers in MySQL.
    Includes endpoints for CRUD operations.
7. mongodb.js
    Implements RESTful APIs for managing customers in MongoDB.
    Includes endpoints for CRUD operations and additional features like date-range filtering.    


API Documentation

1. MySQL-Based APIs (index.js)

Method	Endpoint	Description
GET	    /api/health	Health check for the server.
GET	    /api/db-test	Tests the MySQL database connection.
GET	    /api/customers	Fetches all customers from MySQL.
POST	/api/customers	Creates a new customer in MySQL.
PUT	    /api/customers/:id	Updates a customer.
PATCH	/api/customers/:id	Partially updates a customer.    

2. MongoDB-Based APIs (mongodb.js)

Method	Endpoint	Description
GET	    /api/mongo/health	Health check for MongoDB connection.
GET	    /api/mongo/customers	Fetches all customers from MongoDB.
POST	/api/mongo/customers	Creates a new customer in MongoDB.
PUT	    /api/mongo/customers/:id	Updates a customer (complete replacement).
PATCH	/api/mongo/customers/:id	Partially updates a customer.
DELETE	/api/mongo/customers/:id	Deletes a customer from MongoDB.
GET	    /api/mongo/customers/date-range	Fetches customers   created between two dates.


Flow Diagrams
1. Application Flow

+-------------------+       +-------------------+       +-------------------+
|   Client Request  | --->  |   Express Router  | --->  |   Database Layer  |
+-------------------+       +-------------------+       +-------------------+

2. MongoDB API Flow

+-------------------+       +-------------------+       +-------------------+
|   Client Request  | --->  |   MongoDB Router  | --->  |   Mongoose Model  |
+-------------------+       +-------------------+       +-------------------+

3. MySQL API Flow

+-------------------+       +-------------------+       +-------------------+
|   Client Request  | --->  |   MySQL Router    | --->  |   MySQL Database  |
+-------------------+       +-------------------+       +-------------------+




Database Design

1. MySQL Schema
    Table Name: customers
    Columns:
    id: Primary key, auto-incremented.
    name: Customer name.
    email: Unique email address.
    phone: Phone number.
    created_at: Timestamp of creation.
    updated_at: Timestamp of last update.

2. MongoDB Schema
    Collection Name: customers
    Fields:
    name: Customer name.
    email: Unique email address.
    phone: Phone number.
    createdAt: Timestamp of creation.
    updatedAt: Timestamp of last update.


Error Handling
    Validation Errors: Handled at the schema level (e.g., required fields, unique constraints).
    Database Errors: Caught and returned as JSON responses with appropriate HTTP status codes.
    Custom Error Messages: Provided for better debugging and user experience.

Setup Instructions
1. Prerequisites
    Node.js (v16+)
    MongoDB (v5+)
    MySQL (v8+)

2. Installation

    # Clone the repository
    git clone <repository-url>

    # Navigate to the project directory
    cd CRM_POC

    # Install dependencies
    npm install

3. Database Setup
   
    MySQL: Run the SQL script in schema.sql to create the database and table.
    
    MongoDB: Ensure MongoDB is running locally on localhost:27017

4. Run the Application

    node server.js