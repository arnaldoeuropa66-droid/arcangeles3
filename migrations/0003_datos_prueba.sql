-- Contenido de prueba para San Miguel (3 días)
INSERT INTO contenido_diario 
  (angel_slug, fecha, versiculo, cita_versiculo, oracion, reflexion, bendicion, fecha_creacion)
VALUES
  ('miguel', '2026-09-21',
   'Porque a sus ángeles mandará acerca de ti, que te guarden en todos tus caminos.',
   'Salmo 91:11',
   'San Miguel Arcángel, defiéndeme en la batalla contra el mal. Amén.',
   'Hoy recuerda que no estás solo. Miguel camina a tu lado protegiéndote en cada paso.',
   'Que la protección de San Miguel te acompañe hoy y siempre.',
   strftime('%s', 'now')),
  ('miguel', '2026-09-22',
   'El Señor es mi luz y mi salvación, ¿a quién temeré?',
   'Salmo 27:1',
   'San Miguel, dame valentía para enfrentar lo que venga. Amén.',
   'La valentía no es ausencia de miedo, sino confianza en que Dios va contigo.',
   'Que la fortaleza de San Miguel llene tu corazón.',
   strftime('%s', 'now')),
  ('miguel', '2026-09-23',
   'Esforzaos y cobrad ánimo; no temáis, ni tengáis miedo de ellos.',
   'Deuteronomio 31:6',
   'San Miguel, sé mi escudo en los momentos difíciles. Amén.',
   'Cuando sientas que no puedes más, recuerda que Miguel pelea por ti.',
   'Que la paz de Dios guarde tu corazón.',
   strftime('%s', 'now'));

-- Contenido de prueba para San Gabriel (3 días)
INSERT INTO contenido_diario 
  (angel_slug, fecha, versiculo, cita_versiculo, oracion, reflexion, bendicion, fecha_creacion)
VALUES
  ('gabriel', '2026-09-21',
   'No temas, María, porque has hallado gracia delante de Dios.',
   'Lucas 1:30',
   'San Gabriel, ayúdame a escuchar la voz de Dios con atención. Amén.',
   'A veces Dios habla en susurros. Gabriel te enseña a escuchar.',
   'Que la claridad de San Gabriel ilumine tus decisiones.',
   strftime('%s', 'now')),
  ('gabriel', '2026-09-22',
   'He aquí la sierva del Señor; hágase conmigo conforme a tu palabra.',
   'Lucas 1:38',
   'San Gabriel, enséñame a confiar como María confió. Amén.',
   'La confianza se construye día a día, en lo pequeño.',
   'Que la fe de San Gabriel fortalezca tu alma.',
   strftime('%s', 'now')),
  ('gabriel', '2026-09-23',
   'Bendita tú entre las mujeres, y bendito el fruto de tu vientre.',
   'Lucas 1:42',
   'San Gabriel, ayúdame a reconocer las bendiciones en mi vida. Amén.',
   'Las bendiciones más grandes suelen estar en lo cotidiano.',
   'Que la gracia de San Gabriel te acompañe hoy.',
   strftime('%s', 'now'));

-- Usuario de prueba para poder testear el endpoint
INSERT INTO usuarios_prueba 
  (email, nombre, angel_slug, canal, activo, fecha_alta)
VALUES
  ('test@angelesdeluz.es', 'Usuario de Prueba', 'miguel', 'email', 1, strftime('%s', 'now'));