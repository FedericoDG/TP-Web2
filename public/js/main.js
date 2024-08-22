// DOM
const container = document.getElementById('container');
const departmentSelect = document.getElementById('departmentSelect');
const footer = document.getElementById('footer');
const form = document.getElementById('form');
const gallery = document.getElementById('gallery');
const pagination = document.getElementById('pagination');
const results = document.getElementById('results');
const spinner = document.getElementById('spinner');

// VARIABLES
const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';
let currentPage = 1;
let totalPages = 0;
let currentSearchObject = null;

// EVENTS
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const object = Object.fromEntries(data.entries());

  if (object.keywordInput) {
    fetchObjects(object);
    form.reset();
  }
});

// INIT
getDepartments();

// FUNTIONS
async function getDepartments() {
  try {
    const getDepartments = await fetch(`${baseUrl}/departments`);
    const data = await getDepartments.json();

    const allDepartments = document.createElement('option');
    allDepartments.value = '';
    allDepartments.textContent = 'Todos los departamentos';
    departmentSelect.appendChild(allDepartments);

    data.departments.forEach((dept) => {
      const option = document.createElement('option');
      option.value = dept.departmentId;
      option.textContent = dept.displayName;
      departmentSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

async function fetchObjects(searchObject) {
  try {
    if (searchObject) {
      currentSearchObject = searchObject; // Guardar el objeto de búsqueda actual
    } else {
      searchObject = currentSearchObject; // Usar el objeto de búsqueda guardado si no se pasa uno nuevo
    }

    const { keywordInput, departmentSelect, locationInput } = searchObject;
    seachStarting();

    const query = [];

    if (keywordInput) query.push(`q=${keywordInput}`);
    if (departmentSelect) query.push(`departmentSelect=${departmentSelect}`);
    if (locationInput) query.push(`geoLocation.value=${locationInput}`);

    const url = `${baseUrl}/search?${query.join('&')}&hasImages=true`;

    const objectIDs = await getArtWorkIDs(url);
    const objects = await getArtWors(objectIDs);
    const TranslatedObjects = await getTranslatedArtWorks(objects);

    renderCards(TranslatedObjects);
  } catch (error) {
    console.error(error);
  } finally {
    searchEnding();
    renderPagination();
  }
}

async function getArtWorkIDs(url) {
  try {
    const getObjects = await fetch(url);
    const objects = await getObjects.json();

    const totalResults = objects.objectIDs ? objects.objectIDs.length : 0;
    totalPages = Math.ceil(totalResults / 20);

    const startIndex = (currentPage - 1) * 20;
    const endIndex = startIndex + 20;

    const objectIDs = objects.objectIDs ? objects.objectIDs.slice(startIndex, endIndex) : [];

    return objectIDs;
  } catch (error) {
    console.error(error);
  }
}

async function getArtWors(objectIDs) {
  return await Promise.all(
    objectIDs.map(async (id) =>
      fetch(`${baseUrl}/objects/${id}`)
        .then((res) => res.json())
        .then((data) => data)
        .catch((error) => console.error(error))
    )
  );
}

async function getTranslatedArtWorks(objects) {
  try {
    return await Promise.all(
      objects.map(async (obj) => {
        const result = await translate({
          list: [
            {
              q: obj.title || 'Not available',
            },
            {
              q: obj.culture || 'Not available',
            },
            {
              q: obj.dynasty || 'Not available',
            },
            {
              q: obj.objectDate || 'Not available',
            },
          ],
        });

        return {
          ...obj,
          title: result.translations[0].translation,
          culture: result.translations[1].translation,
          dynasty: result.translations[2].translation,
          objectDate: result.translations[3].translation,
        };
      })
    );
  } catch (error) {
    console.error(error);
  }
}

async function translate(list) {
  try {
    // const res = await fetch('http://localhost:3000/api/translate', {
    const res = await fetch('https://tp-web2-one.vercel.app/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(list),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

function createCard(object) {
  const fragment = document.createDocumentFragment();

  const card = document.createElement('div');
  card.setAttribute('class', 'uk-card uk-card-default uk-border-rounded');

  const mediaTop = document.createElement('div');
  mediaTop.setAttribute('class', 'uk-card-media-top');

  const img = document.createElement('img');
  img.src = object.primaryImageSmall || '../assets/no_image.jpg';
  img.alt = object.title || 'Imagen de obra de arte';
  img.setAttribute('uk-tooltip', `title: ${object.objectDate}; delay: 350`);

  const cardBody = document.createElement('div');
  cardBody.setAttribute('class', 'uk-card-body');

  const title = document.createElement('h3');
  title.setAttribute('class', 'uk-text-default uk-text-bold');
  title.textContent = object.title;

  const culture = document.createElement('p');
  culture.setAttribute('class', 'uk-text-small');
  culture.textContent = `Cultura: ${object.culture}`;

  const dynasty = document.createElement('p');
  dynasty.setAttribute('class', 'uk-text-small');
  dynasty.textContent = `Dinastía: ${object.dynasty}`;

  mediaTop.appendChild(img);
  cardBody.appendChild(title);
  cardBody.appendChild(culture);
  cardBody.appendChild(dynasty);

  if (object?.additionalImages && object.additionalImages.length > 0) {
    const viewMoreImages = document.createElement('a');
    viewMoreImages.setAttribute('class', 'uk-button uk-button-default uk-border-rounded card');
    viewMoreImages.setAttribute('href', `/details.html?objectId=${object.objectID}`);
    viewMoreImages.textContent = 'VER MÁS IMÁGENES';

    cardBody.appendChild(viewMoreImages);
  }

  card.appendChild(mediaTop);
  card.appendChild(cardBody);

  fragment.appendChild(card);

  return fragment;
}

function renderCards(objects) {
  objects.forEach((obj) => {
    const card = createCard(obj);
    gallery.appendChild(card);
  });
}

function renderPagination() {
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const paginationBtn = document.createElement('button');
    paginationBtn.setAttribute(
      'class',
      'uk-button uk-button-secondary uk-button-small pagination-btn uk-border-rounded'
    );
    paginationBtn.textContent = i;
    if (currentPage === i) {
      paginationBtn.setAttribute('disabled', true);
    }
    paginationBtn.addEventListener('click', () => {
      currentPage = i;
      fetchObjects(); // No pasamos un objeto de búsqueda aquí
    });
    pagination.appendChild(paginationBtn);
  }
}

function seachStarting() {
  gallery.innerHTML = '';
  container.classList.remove('hidden');
  container.classList.add('block');
  results.textContent = 'Buscando...';
  pagination.classList.remove('flex');
  pagination.classList.add('hidden');
  spinner.classList.remove('hidden');
  spinner.classList.add('block');
  spinner.scrollIntoView();
}

function searchEnding() {
  results.textContent = 'Resultados';
  spinner.classList.remove('block');
  spinner.classList.add('hidden');
  pagination.classList.remove('hidden');
  pagination.classList.add('flex');

  window.scrollBy({
    top: window.innerHeight - 320,
    behavior: 'smooth',
  });
}
