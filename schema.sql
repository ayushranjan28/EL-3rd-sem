CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  factory VARCHAR(10) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  violation_type VARCHAR(255) NOT NULL,
  assigned_employee_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'Active'
);

-- Run this in Vercel Postgres Query Runner to initialize.
