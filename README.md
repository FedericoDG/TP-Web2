# WEB 2 (Universidad de La Punta) - Trabajo Integrador

## Alumno: Federico González

### Consigna:

Desarrollar una página que consuma imágenes del Museo Metropolitano de Nueva York utilizando la API proporcionada por el [Museo Metropolitano de NY](https://collectionapi.metmuseum.org). La información sobre los endpoints disponibles y cómo usarlos se encuentra en [este repositorio](https://metmuseum.github.io).

#### Requisitos:

1. **Filtros de búsqueda:**

   - La página debe permitir la búsqueda de imágenes de objetos de arte mediante filtros como:
     - Departamento (ej. American Decorative Arts, Arms and Armor, Asian Art, etc.)
     - Palabra clave (objetos de arte que contengan la palabra en los datos del objeto)
     - Localización (objetos que coincidan con una localización, Ej. Europe, China, Paris)
   - El filtrado puede realizarse de manera individual o combinando varios filtros.

2. **Visualización de resultados:**

   - Las imágenes de los objetos deben mostrarse en una grilla de 4 columnas.
   - Cada imagen debe presentarse en una tarjeta (card) con la siguiente información:
     - Imagen del objeto.
     - Título.
     - Cultura.
     - Dinastía.
   - Si el objeto tiene imágenes adicionales, debe incluirse un botón que permita verlas en una página diferente.
   - Al pasar el mouse sobre la imagen, debe mostrarse la fecha (o aproximación) en que el objeto fue diseñado o creado.

3. **Traducción:**

   - El título, cultura y dinastía deben mostrarse en español. Para esto, se utilizará el paquete de Node.js [Google Translate Node JS](https://github.com/statickidz/node-google-translate-skidz).

4. **Paginación:**

   - La página debe mostrar un máximo de 20 objetos recuperados por búsqueda.
   - Si la búsqueda supera este límite, debe implementarse un sistema de paginación para navegar entre los resultados.

5. **Despliegue:**
   - El sitio debe estar publicado en un hosting o servidor accesible por internet. Se debe investigar el proceso de despliegue o publicación de la aplicación en el hosting seleccionado.

### Instrucciones para ejecutar localmente

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/FedericoDG/TP-Web2.git
   ```

2. **Acceder a la carpeta:**

   ```bash
   cd TP-Web2
   ```

3. **Instalar las dependencias del proyecto:**

   ```bash
   npm install
   ```

4. **Variables de entorno:**
   Renombrar el archivo **.env.example** a **.env**, y editar el puerto donde se ejecutará la aplicación.

   ```
   PORT=3000
   ```

5. **Iniciar el servidor en modo de desarrollo:**

   ```bash
   npm run dev
   ```

### Tecnologías utilizadas

- **HTML5:** Estructura del contenido.
- **CSS3:** Estilos y diseño responsivo.
- **JavaScript (ES6+):** Lógica de la aplicación, manejo de eventos y solicitudes a la API del Museo Metropolitano de NY.
- **Google Translate Node JS:** Para ejecutar la traducción de los textos utilizando Google Translate.
- **UIkit:** Framework CSS para el diseño de la interfaz de usuario.
- **Vercel:** Para el despliegue y hosting de la aplicación.
