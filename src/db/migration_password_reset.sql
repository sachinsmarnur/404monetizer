-- Migration: Add password reset functionality
-- Run this migration to add password reset features to existing users table

ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(6) NULL,
ADD COLUMN reset_token_expires TIMESTAMP NULL;

-- Create index for faster lookup of reset tokens
CREATE INDEX idx_users_reset_token ON users(reset_token); 