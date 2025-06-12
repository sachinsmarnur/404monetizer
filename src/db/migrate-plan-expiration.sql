-- Migration script to add plan expiration fields to existing users table
-- Run this if you have an existing database

-- Add new columns for plan expiration tracking
ALTER TABLE users 
ADD COLUMN subscription_started_at TIMESTAMP NULL AFTER plan,
ADD COLUMN plan_expires_at TIMESTAMP NULL AFTER subscription_started_at;

-- Create index for efficient expiration checking
CREATE INDEX idx_users_plan_expires_at ON users(plan_expires_at);

-- Update page status enum to include 'suspended' for expired users
ALTER TABLE pages MODIFY status ENUM('draft', 'active', 'suspended') DEFAULT 'draft';

-- Create index for page status
CREATE INDEX idx_pages_status ON pages(status);