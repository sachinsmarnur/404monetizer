-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    plan ENUM('free', 'pro') DEFAULT 'free',
    subscription_started_at TIMESTAMP NULL,
    plan_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    email_notifications BOOLEAN DEFAULT true,
    reset_token VARCHAR(6) NULL,
    reset_token_expires TIMESTAMP NULL
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    category VARCHAR(50),
    font VARCHAR(50),
    theme ENUM('default', 'rose', 'teal', 'blue', 'olivegreen', 'amber', 'turquoise') DEFAULT 'default',
    social_links JSON,
    monetization_features JSON,
    custom_css TEXT,
    custom_js TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Collected Emails table
CREATE TABLE IF NOT EXISTS collected_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    source VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSON,
    is_external_access BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_collected_emails_page_id ON collected_emails(page_id);
CREATE INDEX idx_analytics_events_page_id ON analytics_events(page_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);

-- User Analytics table (Fixed data types to match referenced tables)
CREATE TABLE IF NOT EXISTS analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    page_id INT NOT NULL,
    views INT DEFAULT 0,
    conversions INT DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    date DATE NOT NULL,
    referrer_url VARCHAR(500) NULL,
    device_type VARCHAR(50) DEFAULT 'desktop',
    country VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_page_date (user_id, page_id, date)
);

-- Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_page_id ON analytics(page_id);
CREATE INDEX idx_analytics_date ON analytics(date);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);

-- Welcome Emails Sent table
CREATE TABLE IF NOT EXISTS welcome_emails_sent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    signup_method ENUM('regular', 'google_oauth') NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_welcome (user_id)
);

-- Follow-up Marketing Emails Sent table
CREATE TABLE IF NOT EXISTS followup_emails_sent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_type ENUM('re_engagement', 'pro_promotion', 'feature_announcement') DEFAULT 're_engagement',
    days_since_signup INT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opened_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_followup_user_id (user_id),
    INDEX idx_followup_sent_at (sent_at),
    INDEX idx_followup_email_type (email_type)
);