-- Initial test user
-- BCrypt hash of "admin123": $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi2
INSERT INTO users (username, email, password, created_at, updated_at) VALUES
('admin', 'admin@hyundai.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample diagnostic records (user_id not required for diagnostic data)
INSERT INTO items (title, description, created_at, updated_at) VALUES
('Theta Engine - VIN: KMHXX00XXXX000001', 'Engine temperature high, requires inspection', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Atkinson Engine - VIN: KMHXX00XXXX000002', 'Normal diagnostic check, all parameters within range', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gamma Engine - VIN: KMHXX00XXXX000003', 'Oil pressure warning detected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Smartstream Engine - VIN: KMHXX00XXXX000004', 'DTC codes detected: P0300, P0420', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Theta Engine - VIN: KMHXX00XXXX000005', 'Critical: Engine overheating', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Atkinson Engine - VIN: KMHXX00XXXX000006', 'Regular maintenance check completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gamma Engine - VIN: KMHXX00XXXX000007', 'Fuel pressure below threshold', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Smartstream Engine - VIN: KMHXX00XXXX000008', 'Throttle position sensor malfunction', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Theta Engine - VIN: KMHXX00XXXX000009', 'MAF sensor reading abnormal', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Atkinson Engine - VIN: KMHXX00XXXX000010', 'All systems normal', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);