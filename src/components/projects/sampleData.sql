-- Insert sample projects for Limitless Her workspace
INSERT INTO projects (name, description, status, workspace_id, owner_id)
VALUES 
(
  'New Credit Card Product for Small Business Owners',
  'Create an attractive new credit card offering for entrepreneurs and small business owners',
  'in_progress',
  (SELECT id FROM workspaces WHERE name = 'Limitless Her'),
  (SELECT id FROM profiles WHERE email = 'joie.cruz@limitlesslab.org')
),
(
  'Green Loan Initiative',
  'A loan product designed specifically for financing environmentally friendly projects, such as renewable energy installations, energy-efficient buildings, and sustainable agriculture practices.',
  'in_progress',
  (SELECT id FROM workspaces WHERE name = 'Limitless Her'),
  (SELECT id FROM profiles WHERE email = 'joie.cruz@limitlesslab.org')
),
(
  'Mobile Banking for Rural Areas',
  'Development of a mobile banking app tailored for rural populations, providing easy access to banking services such as savings accounts, loans, and remittances',
  'completed',
  (SELECT id FROM workspaces WHERE name = 'Limitless Her'),
  (SELECT id FROM profiles WHERE email = 'joie.cruz@limitlesslab.org')
);