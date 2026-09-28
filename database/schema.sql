-- CivicFix Database Schema
-- Run this script to create the database and tables manually if needed
-- Spring Boot with ddl-auto=update will auto-create tables on startup

CREATE DATABASE IF NOT EXISTS civicfix
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE civicfix;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('CITIZEN', 'ADMIN') NOT NULL DEFAULT 'CITIZEN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500)
);

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('ROAD_POTHOLE','GARBAGE','STREETLIGHT','WATER','DRAINAGE','PUBLIC_PROPERTY','OTHER') NOT NULL,
    status ENUM('REPORTED','IN_PROGRESS','RESOLVED','REJECTED') NOT NULL DEFAULT 'REPORTED',
    image_path VARCHAR(500),
    latitude DOUBLE,
    longitude DOUBLE,
    address VARCHAR(500),
    reported_by BIGINT NOT NULL,
    assigned_department_id BIGINT,
    admin_remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (reported_by) REFERENCES users(id),
    FOREIGN KEY (assigned_department_id) REFERENCES departments(id)
);

-- Issue Status History
CREATE TABLE IF NOT EXISTS issue_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    old_status ENUM('REPORTED','IN_PROGRESS','RESOLVED','REJECTED'),
    new_status ENUM('REPORTED','IN_PROGRESS','RESOLVED','REJECTED') NOT NULL,
    remarks TEXT,
    changed_by VARCHAR(150),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id)
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Sample Departments
INSERT IGNORE INTO departments (name, description) VALUES
('Road Maintenance', 'Handles road repairs, pothole filling, and road infrastructure'),
('Sanitation', 'Manages garbage collection, waste disposal, and cleanliness'),
('Water Supply', 'Manages water distribution, leakage repairs, and supply issues'),
('Electrical Department', 'Handles streetlights, electrical infrastructure, and power issues'),
('Drainage Department', 'Manages drainage systems, flood prevention, and sewage'),
('Public Works', 'Handles public property maintenance and infrastructure');

-- Demo Admin user (password: Admin@123)
-- BCrypt hash for "Admin@123"
INSERT IGNORE INTO users (name, email, password, phone, role) VALUES
('Admin User', 'admin@civicfix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '9000000001', 'ADMIN');

-- Demo Citizen user (password: Citizen@123)
-- BCrypt hash for "Citizen@123"
INSERT IGNORE INTO users (name, email, password, phone, role) VALUES
('Rahul Sharma', 'citizen@civicfix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '9000000002', 'CITIZEN');

-- NOTE: The BCrypt hashes above are placeholder hashes for the string "password"
-- The DataSeeder.java class creates proper BCrypt hashes at startup
-- Default demo credentials:
--   Admin:   admin@civicfix.com   / Admin@123
--   Citizen: citizen@civicfix.com / Citizen@123
