const cors = require('cors');
const express = require('express');
var path = require('path');
require('dotenv').config();

const app = express();
const indexRoutes = require('./src/routes/index.routes');

//Settings
const port = process.env.PORT || 3000;

//Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors('*'));

// Templete engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Routes
app.use('/api', indexRoutes);

app.get('/', (_, res) => {
  res.render('index');
});

app.get('/details', (req, res) => {
  try {
    const additionalImagesString = req.query.additionalImages;

    const additionalImages = JSON.parse(decodeURIComponent(additionalImagesString));

    // Si falta algún dato necesario en la URL o en los parámetros de la solicitud, puede lanzar un error
    if (!additionalImages) {
      throw new Error('No se encontraron imágenes adicionales');
    }

    res.render('details', { additionalImages });
  } catch (error) {
    console.error('Error al renderizar la página de detalles:', error.message);
    // Redirige a una página de error personalizada o la página principal
    res.redirect('/error'); // Redirige a una página de error personalizada
  }
});

// Página de error personalizada
app.get('/error', (req, res) => {
  res.status(500).render('error', {
    message: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.',
  });
});

// Middleware de manejo de errores (se coloca después de todas las rutas)
/* app.use((err, req, res, next) => {
  res.status(500).send('Algo salió mal. Por favor, vuelve a intentarlo más tarde.');
}); */

//Server init
app.listen(port, () => {
  console.clear();
  console.log(`Server live on port: ${port}`);
});
