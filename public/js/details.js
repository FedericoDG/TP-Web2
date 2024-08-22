// DOM
const spinner = document.getElementById('spinner');
const sliderContainer = document.getElementById('sliderContainer');
const slider = document.getElementById('slider');

// VARIABLES
const urlParams = new URLSearchParams(window.location.search);
const objectId = urlParams.get('objectId');
const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';

// init
init();

// FUNCTIONS
async function init() {
  try {
    if (!objectId) {
      history.back();
    }
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
  } catch (error) {
    console.error(error);
  }
}

async function getArtWork(objectId) {
  try {
    const response = await fetch(`${baseUrl}/objects/${objectId}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

function createCard(object) {
  const fragment = document.createDocumentFragment();

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

  link.appendChild(img);
  container.appendChild(link);
  container.appendChild(overlay);

  fragment.appendChild(container);

  return fragment;
}

function renderExtraImages(array) {
  array.forEach((el, i) => {
    const card = createCard(el);
    slider.appendChild(card);
  });
}
