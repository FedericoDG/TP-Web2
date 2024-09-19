const cors = require('cors');
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const indexRoutes = require('./src/routes/index.routes');

// Settings
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors('*'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api', indexRoutes);

app.get('/', (_req, res) => {
  res.render('index');
});

app.get('/details', (req, res) => {
  try {
    const additionalImagesString = req.query.additionalImages;
    const additionalImages = JSON.parse(decodeURIComponent(additionalImagesString));

    if (!additionalImages) {
      throw new Error('No se encontraron imágenes adicionales');
    }

    res.render('details', { additionalImages });
  } catch (error) {
    console.error('Error al renderizar la página de detalles:', error.message);
    res.redirect('/error');
  }
});

app.get('/error', (_req, res) => {
  res.status(500).render('error', {
    message: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.',
  });
});

// Middleware para manejar errores 404
app.use((_req, res, _next) => {
  res.status(404).render('404', {
    message: 'Lo sentimos, la página que estás buscando no existe.',
  });
});

// Server init
app.listen(port, () => {
  console.clear();
  console.log(`Server live on: http://localhost:${port}`);
});
