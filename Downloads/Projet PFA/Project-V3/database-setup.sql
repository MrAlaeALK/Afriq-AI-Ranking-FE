-- =====================================================
-- Afriq-AI-Ranking Database Setup Script
-- =====================================================

-- 1. Insert dimensions first (needed for foreign key references)
INSERT INTO dimension (name, description, display_order, created_date, last_modified_date) VALUES
('Digital Infrastructure', 'Infrastructure and connectivity metrics for digital readiness', 1, NOW(), NOW()),
('AI Research & Development', 'Research output and innovation in artificial intelligence', 2, NOW(), NOW()),
('Government & Policy', 'Government initiatives and policy framework for AI adoption', 3, NOW(), NOW()),
('Education & Skills', 'Educational infrastructure and AI-related skills development', 4, NOW(), NOW()),
('Economic Environment', 'Economic factors supporting AI development and adoption', 5, NOW(), NOW());

-- 2. Insert African countries
INSERT INTO country (name, code, region, created_date, last_modified_date) VALUES
('Algeria', 'DZ', 'North Africa', NOW(), NOW()),
('Egypt', 'EG', 'North Africa', NOW(), NOW()),
('Morocco', 'MA', 'North Africa', NOW(), NOW()),
('Tunisia', 'TN', 'North Africa', NOW(), NOW()),
('Nigeria', 'NG', 'West Africa', NOW(), NOW()),
('Ghana', 'GH', 'West Africa', NOW(), NOW()),
('Kenya', 'KE', 'East Africa', NOW(), NOW()),
('South Africa', 'ZA', 'Southern Africa', NOW(), NOW()),
('Ethiopia', 'ET', 'East Africa', NOW(), NOW()),
('Tanzania', 'TZ', 'East Africa', NOW(), NOW()),
('Rwanda', 'RW', 'East Africa', NOW(), NOW()),
('Senegal', 'SN', 'West Africa', NOW(), NOW()),
('Côte d''Ivoire', 'CI', 'West Africa', NOW(), NOW()),
('Uganda', 'UG', 'East Africa', NOW(), NOW()),
('Cameroon', 'CM', 'Central Africa', NOW(), NOW());

-- 3. Fix foreign key constraint (if needed)
-- Drop problematic constraint and add correct one
ALTER TABLE indicator DROP CONSTRAINT IF EXISTS "FK2ejebst6rjf58xoq03cbwdn0j";
ALTER TABLE indicator ADD CONSTRAINT fk_indicator_dimension 
FOREIGN KEY (category_id) REFERENCES dimension(id);

-- 4. Insert indicators for Digital Infrastructure (ID = 1)
INSERT INTO indicator (name, description, category_id, normalization_type, weight, created_date, last_modified_date) VALUES
('Internet Penetration', 'Metric for Internet Penetration', 1, 'MIN_MAX', 1, NOW(), NOW()),
('Digital Infrastructure', 'Metric for Digital Infrastructure', 1, 'MIN_MAX', 1, NOW(), NOW()),
('Mobile Connectivity', 'Metric for Mobile Connectivity', 1, 'MIN_MAX', 1, NOW(), NOW()),
('Broadband Access', 'Metric for Broadband Access', 1, 'MIN_MAX', 1, NOW(), NOW()),
('Digital Payment Systems', 'Metric for Digital Payment Systems', 1, 'MIN_MAX', 1, NOW(), NOW()),
('E-Government Services', 'Metric for E-Government Services', 1, 'MIN_MAX', 1, NOW(), NOW());

-- 5. Insert indicators for AI Research & Development (ID = 2)
INSERT INTO indicator (name, description, category_id, normalization_type, weight, created_date, last_modified_date) VALUES
('AI Research Papers', 'Metric for AI Research Papers', 2, 'MIN_MAX', 1, NOW(), NOW()),
('AI Patents', 'Metric for AI Patents', 2, 'MIN_MAX', 1, NOW(), NOW()),
('R&D Investment', 'Metric for R&D Investment', 2, 'MIN_MAX', 1, NOW(), NOW()),
('AI Startups', 'Metric for AI Startups', 2, 'MIN_MAX', 1, NOW(), NOW()),
('Tech Talent Pool', 'Metric for Tech Talent Pool', 2, 'MIN_MAX', 1, NOW(), NOW()),
('University AI Programs', 'Metric for University AI Programs', 2, 'MIN_MAX', 1, NOW(), NOW());

-- 6. Insert indicators for Government & Policy (ID = 3)
INSERT INTO indicator (name, description, category_id, normalization_type, weight, created_date, last_modified_date) VALUES
('AI Strategy', 'Metric for AI Strategy', 3, 'MIN_MAX', 1, NOW(), NOW()),
('Data Protection Laws', 'Metric for Data Protection Laws', 3, 'MIN_MAX', 1, NOW(), NOW()),
('Digital ID Systems', 'Metric for Digital ID Systems', 3, 'MIN_MAX', 1, NOW(), NOW()),
('Public AI Investment', 'Metric for Public AI Investment', 3, 'MIN_MAX', 1, NOW(), NOW()),
('Regulatory Framework', 'Metric for Regulatory Framework', 3, 'MIN_MAX', 1, NOW(), NOW());

-- 7. Insert indicators for Education & Skills (ID = 4)
INSERT INTO indicator (name, description, category_id, normalization_type, weight, created_date, last_modified_date) VALUES
('Digital Literacy Rate', 'Metric for Digital Literacy Rate', 4, 'MIN_MAX', 1, NOW(), NOW()),
('STEM Education', 'Metric for STEM Education', 4, 'MIN_MAX', 1, NOW(), NOW()),
('Technical Training Programs', 'Metric for Technical Training Programs', 4, 'MIN_MAX', 1, NOW(), NOW()),
('AI Course Availability', 'Metric for AI Course Availability', 4, 'MIN_MAX', 1, NOW(), NOW()),
('ICT Skills', 'Metric for ICT Skills', 4, 'MIN_MAX', 1, NOW(), NOW());

-- 8. Insert indicators for Economic Environment (ID = 5)
INSERT INTO indicator (name, description, category_id, normalization_type, weight, created_date, last_modified_date) VALUES
('GDP per Capita', 'Metric for GDP per Capita', 5, 'MIN_MAX', 1, NOW(), NOW()),
('Innovation Index', 'Metric for Innovation Index', 5, 'MIN_MAX', 1, NOW(), NOW()),
('Business Environment', 'Metric for Business Environment', 5, 'MIN_MAX', 1, NOW(), NOW()),
('Venture Capital Investment', 'Metric for Venture Capital Investment', 5, 'MIN_MAX', 1, NOW(), NOW()),
('Technology Adoption Rate', 'Metric for Technology Adoption Rate', 5, 'MIN_MAX', 1, NOW(), NOW());

-- 9. Add dimension weights for ranking calculation
INSERT INTO dimension_weight (dimension_id, dimension_weight, year) VALUES
(1, 20.0, 2025), -- Digital Infrastructure
(2, 25.0, 2025), -- AI Research & Development  
(3, 20.0, 2025), -- Government & Policy
(4, 20.0, 2025), -- Education & Skills
(5, 15.0, 2025); -- Economic Environment

-- 10. Add indicator weights (adjust dimension_weight IDs as needed)
-- For Digital Infrastructure dimension
INSERT INTO indicator_weight (indicator_id, weight, dimension_weight_id)
SELECT i.id, 1.0, 1
FROM indicator i 
WHERE i.category_id = 1;

-- For AI Research & Development dimension
INSERT INTO indicator_weight (indicator_id, weight, dimension_weight_id)
SELECT i.id, 1.0, 2
FROM indicator i 
WHERE i.category_id = 2;

-- For Government & Policy dimension
INSERT INTO indicator_weight (indicator_id, weight, dimension_weight_id)
SELECT i.id, 1.0, 3
FROM indicator i 
WHERE i.category_id = 3;

-- For Education & Skills dimension
INSERT INTO indicator_weight (indicator_id, weight, dimension_weight_id)
SELECT i.id, 1.0, 4
FROM indicator i 
WHERE i.category_id = 4;

-- For Economic Environment dimension
INSERT INTO indicator_weight (indicator_id, weight, dimension_weight_id)
SELECT i.id, 1.0, 5
FROM indicator i 
WHERE i.category_id = 5;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check countries
SELECT COUNT(*) as country_count FROM country;

-- Check dimensions  
SELECT COUNT(*) as dimension_count FROM dimension;

-- Check indicators
SELECT COUNT(*) as indicator_count FROM indicator;

-- Check dimension weights
SELECT COUNT(*) as dimension_weight_count FROM dimension_weight;

-- Check indicator weights
SELECT COUNT(*) as indicator_weight_count FROM indicator_weight;

-- View complete setup
SELECT 
    d.name as dimension_name,
    COUNT(i.id) as indicator_count,
    STRING_AGG(i.name, ', ' ORDER BY i.name) as indicators
FROM dimension d
LEFT JOIN indicator i ON d.id = i.category_id
GROUP BY d.id, d.name
ORDER BY d.display_order; 