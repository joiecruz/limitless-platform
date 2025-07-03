-- Insert Design Thinking methodology
INSERT INTO methodologies (id, name, description) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Design Thinking', 'Human-centered approach to innovation that integrates user needs, technology possibilities, and business requirements');

-- Insert workflow stages for Design Thinking
INSERT INTO workflow_stages (id, name, description, order_index) VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'Project Brief', 'Define project scope, objectives, and initial requirements', 1),
('660e8400-e29b-41d4-a716-446655440002', 'Empathize', 'Understand user needs through observation and engagement', 2),
('660e8400-e29b-41d4-a716-446655440003', 'Define', 'Synthesize observations and define core problems', 3),
('660e8400-e29b-41d4-a716-446655440004', 'Ideate', 'Generate creative solutions and ideas', 4),
('660e8400-e29b-41d4-a716-446655440005', 'Prototype', 'Build testable representations of ideas', 5),
('660e8400-e29b-41d4-a716-446655440006', 'Test', 'Test prototypes with users and gather feedback', 6),
('660e8400-e29b-41d4-a716-446655440007', 'Implement', 'Execute and deploy the solution', 7),
('660e8400-e29b-41d4-a716-446655440008', 'Measure', 'Evaluate impact and success metrics', 8);

-- Connect stages to Design Thinking methodology
INSERT INTO methodology_stages (id, methodology_id, stage_id, order_index) VALUES 
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 1),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 2),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440003', 3),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440004', 4),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440005', 5),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440006', 6),
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440007', 7),
('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440008', 8);

-- Insert steps for Empathize stage
INSERT INTO stage_steps (id, stage_id, name, description, order_index) VALUES 
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Select your user research method', 'Choose between User Interviews, Surveys, or Focus Groups', 1),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Create a User Research Plan', 'Develop comprehensive plan for user research activities', 2),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Conduct User Research', 'Execute the research plan and gather user data', 3),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Generate insights from your user research', 'Analyze research data and extract key insights', 4),
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Create customer persona/s', 'Develop detailed user personas based on research', 5);

-- Insert steps for Define stage  
INSERT INTO stage_steps (id, stage_id, name, description, order_index) VALUES 
('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', 'Review main insights', 'Synthesize key findings from empathize stage', 1),
('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', 'Reframe your design challenge', 'Refine problem statement based on insights', 2),
('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', 'Select your new design challenge', 'Choose final design challenge to move forward', 3);

-- Insert steps for Ideate stage
INSERT INTO stage_steps (id, stage_id, name, description, order_index) VALUES 
('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440004', 'Collect Ideas', 'Generate and gather creative solutions and ideas', 1);

-- Insert steps for Prototype stage
INSERT INTO stage_steps (id, stage_id, name, description, order_index) VALUES 
('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440005', 'Choose your prototype types', 'Select appropriate prototyping methods and types', 1),
('880e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440005', 'Work on your prototype', 'Build and develop the chosen prototype', 2);

-- Insert steps for Test stage
INSERT INTO stage_steps (id, stage_id, name, description, order_index) VALUES 
('880e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440006', 'Select your user testing method', 'Choose appropriate user testing methodology', 1),
('880e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440006', 'Create a user test plan', 'Develop comprehensive testing plan and protocol', 2),
('880e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440006', 'Conduct actual user testing', 'Execute testing plan with real users', 3),
('880e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440006', 'Generate insights from your user test', 'Analyze testing results and extract insights', 4);

-- Insert steps for Implement stage
INSERT INTO stage_steps (id, stage_id, name, description, order_index) VALUES 
('880e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440007', 'Measurement Framework', 'Define metrics and KPIs for success measurement', 1),
('880e8400-e29b-41d4-a716-446655440017', '660e8400-e29b-41d4-a716-446655440007', 'Implementation Plan', 'Create detailed plan for solution deployment', 2),
('880e8400-e29b-41d4-a716-446655440018', '660e8400-e29b-41d4-a716-446655440007', 'Budget', 'Develop budget and resource allocation plan', 3),
('880e8400-e29b-41d4-a716-446655440019', '660e8400-e29b-41d4-a716-446655440007', 'Files', 'Organize and prepare implementation files and documentation', 4);