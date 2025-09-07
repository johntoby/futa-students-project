-- PostgreSQL setup script for FUTA Students API
-- Run this script as a PostgreSQL superuser

-- Create databases
CREATE DATABASE futa_students;
CREATE DATABASE futa_students_test;

-- Create user (optional - you can use existing postgres user)
-- CREATE USER futa_admin WITH PASSWORD 'your_secure_password';

-- Grant privileges (if you created a new user)
-- GRANT ALL PRIVILEGES ON DATABASE futa_students TO futa_admin;
-- GRANT ALL PRIVILEGES ON DATABASE futa_students_test TO futa_admin;

-- Connect to the main database
\c futa_students;

-- The application will create tables via migrations
-- This script just sets up the databases