-- Seed data for demo presentation
-- This creates realistic data for the Incolab system demo

-- Insert demo service references
INSERT INTO service_references (
  id,
  reference_number,
  client_name,
  client_contact,
  client_email,
  service_type,
  sample_description,
  location,
  sample_weight,
  urgent,
  special_instructions,
  status,
  created_at
) VALUES
-- Completed references for showing history
(
  'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
  'REF-2025-001',
  'Minera El Cerrejón S.A.',
  'Carlos Rodríguez',
  'carlos.rodriguez@cerrejon.com',
  'both',
  'Carbón bituminoso para análisis completo de calidad y certificación de cantidad para exportación',
  'Mina El Cerrejón, La Guajira',
  5000.0,
  false,
  'Análisis completo proximate y ultimate, certificación para puerto de embarque',
  'completed',
  '2025-01-15T08:30:00.000Z'
),
(
  'fc603d39-eece-4d77-986f-30163d78e349',
  'REF-2025-002',
  'Industria Carboquímica XYZ Ltda.',
  'María González',
  'maria.gonzalez@carboquimica.com',
  'quality_analysis',
  'Biomasa pelletizada para evaluación de poder calorífico y contenido de cenizas',
  'Planta Industrial Bogotá, Cundinamarca',
  1200.0,
  false,
  'Evaluar viabilidad para mezcla con carbón térmico',
  'completed',
  '2025-01-18T14:15:00.000Z'
),
-- Current active references showing different stages
(
  '86816cb9-443d-45d0-8aa4-7adb9c6d54ff',
  'REF-2025-003',
  'Drummond Company Inc.',
  'James Patterson',
  'j.patterson@drummondco.com',
  'quantity_certification',
  'Carbón térmico para exportación - certificación de cantidad y calidad básica',
  'Puerto de Ciénaga, Magdalena',
  8500.0,
  true,
  'URGENTE: Buque zarpa mañana, requiere certificado inmediato',
  'in_progress',
  '2025-01-22T06:00:00.000Z'
),
(
  'b7f23456-789a-4bcd-9e01-23456789abcd',
  'REF-2025-004',
  'Carbones del Caribe S.A.S.',
  'Ana Martínez',
  'ana.martinez@carbonescaribe.com',
  'both',
  'Carbón térmico nacional para análisis de combustibilidad y certificación',
  'Mina La Jagua, Cesar',
  3200.0,
  false,
  'Muestra representativa de lote de 50,000 toneladas',
  'pending',
  '2025-01-22T10:30:00.000Z'
),
(
  'c8e34567-890b-4cde-af02-3456789bcdef',
  'REF-2025-005',
  'Ecopetrol S.A.',
  'Luis Fernando Silva',
  'luis.silva@ecopetrol.com.co',
  'quality_analysis',
  'Coque de petróleo para análisis elemental y poder calorífico',
  'Refinería de Barrancabermeja, Santander',
  800.0,
  false,
  'Análisis para proceso de co-combustión en termoeléctricas',
  'pending',
  '2025-01-22T13:45:00.000Z'
),
-- Recent references to show activity
(
  'd9f45678-901c-4def-b023-456789cdefab',
  'REF-2025-006',
  'Grupo Prodeco (Glencore)',
  'Roberto Pérez',
  'roberto.perez@prodeco.com.co',
  'both',
  'Carbón metalúrgico para análisis de calidad y certificación de embarque',
  'Mina Calenturitas, Cesar',
  6800.0,
  true,
  'URGENTE: Contrato internacional requiere certificación en 24 horas',
  'pending',
  '2025-01-22T16:20:00.000Z'
);

-- Insert operations based on the service references
INSERT INTO operations (
  id,
  reference_id,
  operation_type,
  assigned_operator,
  status,
  scheduled_date,
  completed_date,
  notes,
  created_at
) VALUES
-- Completed operations
(
  'op001', 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86', 'muestreo', 'Carlos Mendoza', 'completed',
  '2025-01-15T10:00:00.000Z', '2025-01-15T12:30:00.000Z',
  'Muestreo completo realizado según protocolo ASTM D2013. Muestra representativa obtenida.',
  '2025-01-15T08:30:00.000Z'
),
(
  'op002', 'fc603d39-eece-4d77-986f-30163d78e349', 'muestreo', 'Andrea López', 'completed',
  '2025-01-18T16:00:00.000Z', '2025-01-18T17:45:00.000Z',
  'Muestreo de biomasa pelletizada completado. Muestra homogénea obtenida.',
  '2025-01-18T14:15:00.000Z'
),
-- Active operations
(
  'op003', '86816cb9-443d-45d0-8aa4-7adb9c6d54ff', 'muestreo', 'Carlos Mendoza', 'in_progress',
  '2025-01-22T08:00:00.000Z', NULL,
  'En puerto realizando muestreo. Proceso al 60%. Muestra de barcaza completada.',
  '2025-01-22T06:00:00.000Z'
),
-- Pending operations
(
  'op004', 'b7f23456-789a-4bcd-9e01-23456789abcd', 'muestreo', NULL, 'pending',
  '2025-01-23T09:00:00.000Z', NULL,
  'Pendiente asignación de operador y coordinación de acceso a mina.',
  '2025-01-22T10:30:00.000Z'
),
(
  'op005', 'c8e34567-890b-4cde-af02-3456789bcdef', 'muestreo', 'Andrea López', 'assigned',
  '2025-01-23T14:00:00.000Z', NULL,
  'Asignado a Andrea López. Coordinando acceso a refinería.',
  '2025-01-22T13:45:00.000Z'
),
(
  'op006', 'd9f45678-901c-4def-b023-456789cdefab', 'muestreo', 'Carlos Mendoza', 'urgent',
  '2025-01-22T18:00:00.000Z', NULL,
  'URGENTE - Asignado a Carlos Mendoza. Debe completarse antes de medianoche.',
  '2025-01-22T16:20:00.000Z'
);

-- Insert lab analysis records
INSERT INTO lab_analysis (
  id,
  reference_id,
  assigned_analyst,
  status,
  sample_received_date,
  analysis_start_date,
  analysis_completion_date,
  moisture_content,
  ash_content,
  volatile_matter,
  fixed_carbon,
  sulfur_content,
  calorific_value,
  lab_notes,
  created_at
) VALUES
-- Completed analyses
(
  'lab001', 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86', 'Dr. Patricia Morales', 'completed',
  '2025-01-15T13:00:00.000Z', '2025-01-16T08:00:00.000Z', '2025-01-17T16:00:00.000Z',
  8.2, 12.5, 35.8, 43.5, 0.65, 6250.0,
  'Análisis completo realizado. Carbón de excelente calidad para exportación.',
  '2025-01-15T08:30:00.000Z'
),
(
  'lab002', 'fc603d39-eece-4d77-986f-30163d78e349', 'Ing. Roberto Castillo', 'completed',
  '2025-01-18T18:00:00.000Z', '2025-01-19T09:00:00.000Z', '2025-01-20T15:30:00.000Z',
  10.5, 4.2, 78.3, 7.0, 0.08, 4850.0,
  'Biomasa de alta calidad. Bajo contenido de azufre ideal para co-combustión.',
  '2025-01-18T14:15:00.000Z'
),
-- Active analyses
(
  'lab003', '86816cb9-443d-45d0-8aa4-7adb9c6d54ff', 'Dr. Patricia Morales', 'in_analysis',
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  'Esperando muestra del puerto. Análisis programado para inicio inmediato.',
  '2025-01-22T06:00:00.000Z'
),
-- Waiting for samples
(
  'lab004', 'b7f23456-789a-4bcd-9e01-23456789abcd', NULL, 'waiting_sample',
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  'Esperando recepción de muestra de operaciones.',
  '2025-01-22T10:30:00.000Z'
),
(
  'lab005', 'c8e34567-890b-4cde-af02-3456789bcdef', 'Ing. Roberto Castillo', 'waiting_sample',
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  'Analista asignado. Esperando muestra de refinería.',
  '2025-01-22T13:45:00.000Z'
),
(
  'lab006', 'd9f45678-901c-4def-b023-456789cdefab', 'Dr. Patricia Morales', 'waiting_sample',
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
  'URGENTE - Dr. Morales en standby para análisis inmediato al recibir muestra.',
  '2025-01-22T16:20:00.000Z'
);

-- Insert some additional historical data for better demo statistics
INSERT INTO service_references (
  reference_number, client_name, client_contact, client_email,
  service_type, sample_description, location, sample_weight,
  urgent, special_instructions, status, created_at
) VALUES
('REF-2025-007', 'Anglo American Carbones', 'Susan Miller', 's.miller@angloamerican.com',
 'both', 'Carbón metalúrgico premium para siderúrgicas', 'Mina El Paso, Cesar', 4500.0,
 false, 'Especificaciones técnicas para cliente japonés', 'completed', '2025-01-10T09:00:00.000Z'),

('REF-2025-008', 'Termocandelaria S.A.', 'Fernando Ayala', 'f.ayala@termocandelaria.com',
 'quality_analysis', 'Carbón térmico para planta termoeléctrica', 'Puerto Bolívar, La Guajira', 2800.0,
 false, 'Análisis de calidad para contrato mensual', 'completed', '2025-01-12T11:30:00.000Z'),

('REF-2025-009', 'Carbones de Colombia S.A.', 'Alejandra Ruiz', 'a.ruiz@carbocoal.com',
 'quantity_certification', 'Certificación de embarque carbón térmico', 'Puerto de Santa Marta', 7200.0,
 true, 'Certificación urgente para buque en puerto', 'completed', '2025-01-08T07:15:00.000Z');