// DOM
const spinner = document.getElementById('spinner');
const sliderContainer = document.getElementById('sliderContainer');
const slider = document.getElementById('slider');

const urlParams = new URLSearchParams(window.location.search);
const objectId = urlParams.get('objectId');

const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';

init();

async function init() {
  const object = await getArtWork(objectId);
  const { additionalImages } = object;

  spinner.classList.add('hidden');
  sliderContainer.classList.remove('hidden');

  const objects = additionalImages.map((image, idx) => ({
    imageSrc: image,
    imageAlt: object.title,
    imageHref: image,
    imageCaption: object.title,
  }));

  renderExtraImages(objects);
}

async function getArtWork(objectId) {
  const response = await fetch(`${baseUrl}/objects/${objectId}`);
  const data = await response.json();

  return data;
}

function createCard(object) {
  // Crear un fragmento de documento para mejorar el rendimiento
  const fragment = document.createDocumentFragment();

  // Crear la estructura de la tarjeta
  const container = document.createElement('div');

  const link = document.createElement('a');
  link.href = object.imageHref || './assets/hero.jpg';
  link.setAttribute('data-lightbox', 'models');
  link.setAttribute('data-title', object.imageCaption || 'Caption de la imagen');

  const img = document.createElement('img');
  img.src = object.imageSrc || './assets/hero.jpg';
  img.width = object.imageWidth || 300;
  img.height = object.imageHeight || 450;
  img.alt = object.imageAlt || 'Descripción de la imagen';

  const overlay = document.createElement('div');
  overlay.setAttribute('class', 'uk-position-center uk-panel');

  // Ensamblar el contenido
  link.appendChild(img);
  container.appendChild(link);
  container.appendChild(overlay);

  // Añadir el contenedor al fragmento
  fragment.appendChild(container);

  return fragment;
}

function renderExtraImages(array) {
  array.forEach((el, i) => {
    const card = createCard(el);
    slider.appendChild(card);
  });
}
