INSERT INTO courses (
    title,
    instructor,
    platform,
    category,
    level,
    price,
    duration_hours,
    lessons,
    language,
    description,
    image_url
)
SELECT
    'React Interface Systems',
    'Camila Mendoza',
    'Udemy',
    'Frontend',
    'intermediate',
    24.99,
    18,
    42,
    'English',
    'Disena interfaces modulares y aprende a estructurar componentes con foco en mantenibilidad.',
    ''
WHERE NOT EXISTS (
    SELECT 1
    FROM courses
    WHERE title = 'React Interface Systems'
);

INSERT INTO courses (
    title,
    instructor,
    platform,
    category,
    level,
    price,
    duration_hours,
    lessons,
    language,
    description,
    image_url
)
SELECT
    'Go APIs from Scratch',
    'Mario Sierra',
    'Platzi',
    'Backend',
    'advanced',
    31.50,
    14,
    30,
    'Spanish',
    'Construye servicios REST claros, pequenos y rapidos con Go, rutas y persistencia.',
    ''
WHERE NOT EXISTS (
    SELECT 1
    FROM courses
    WHERE title = 'Go APIs from Scratch'
);

INSERT INTO courses (
    title,
    instructor,
    platform,
    category,
    level,
    price,
    duration_hours,
    lessons,
    language,
    description,
    image_url
)
SELECT
    'SQL para Analisis',
    'Laura Benitez',
    'Coursera',
    'Data',
    'beginner',
    19.00,
    10,
    26,
    'Spanish',
    'Practica consultas reales, agregaciones y reportes para analisis de datos y dashboards.',
    ''
WHERE NOT EXISTS (
    SELECT 1
    FROM courses
    WHERE title = 'SQL para Analisis'
);

INSERT INTO courses (
    title,
    instructor,
    platform,
    category,
    level,
    price,
    duration_hours,
    lessons,
    language,
    description,
    image_url
)
SELECT
    'Brand and UI Foundations',
    'Sofia Ruiz',
    'Domestika',
    'Design',
    'intermediate',
    22.00,
    11,
    21,
    'English',
    'Aprende a crear sistemas visuales coherentes para productos digitales y paginas de marketing.',
    ''
WHERE NOT EXISTS (
    SELECT 1
    FROM courses
    WHERE title = 'Brand and UI Foundations'
);

INSERT INTO courses (
    title,
    instructor,
    platform,
    category,
    level,
    price,
    duration_hours,
    lessons,
    language,
    description,
    image_url
)
SELECT
    'Notion for Deep Work',
    'Adrian Rojas',
    'Skillshare',
    'Productividad',
    'beginner',
    12.00,
    7,
    16,
    'Spanish',
    'Organiza objetivos, tareas y notas en un flujo simple pensado para estudiantes y creadores.',
    ''
WHERE NOT EXISTS (
    SELECT 1
    FROM courses
    WHERE title = 'Notion for Deep Work'
);

INSERT INTO courses (
    title,
    instructor,
    platform,
    category,
    level,
    price,
    duration_hours,
    lessons,
    language,
    description,
    image_url
)
SELECT
    'Node Architecture Patterns',
    'Daniel Castro',
    'Frontend Masters',
    'Backend',
    'advanced',
    35.00,
    15,
    34,
    'English',
    'Refuerza capas, validaciones, errores y modularidad para proyectos Node bien mantenidos.',
    ''
WHERE NOT EXISTS (
    SELECT 1
    FROM courses
    WHERE title = 'Node Architecture Patterns'
);
