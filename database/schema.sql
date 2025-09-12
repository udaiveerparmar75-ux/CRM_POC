-- Create database
CREATE DATABASE IF NOT EXISTS crm_poc;
USE crm_poc;

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO customers (name, email, phone) VALUES
('John Doe', 'john.doe@example.com', '+1234567890'),
('Jane Smith', 'jane.smith@example.com', '+0987654321'),
('Bob Johnson', 'bob.johnson@example.com', '+1122334455')
ON DUPLICATE KEY UPDATE name=VALUES(name);
