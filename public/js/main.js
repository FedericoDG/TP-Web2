// DOM
const container = document.getElementById('container');
const departmentSelect = document.getElementById('departmentSelect');
const footer = document.getElementById('footer');
const form = document.getElementById('form');
const gallery = document.getElementById('gallery');
const pagination = document.getElementById('pagination');
const results = document.getElementById('results');
const spinner = document.getElementById('spinner');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const object = Object.fromEntries(data.entries());

  if (object.keywordInput) fetchObjects(object);
});

const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';
let currentPage = 1;
let totalPages = 0;

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
    const { keywordInput, departmentSelect, locationInput } = searchObject;
    seachStarting();

    const query = [];

    if (keywordInput) query.push(`q=${keywordInput}`);
    if (departmentSelect) query.push(`departmentSelect=${departmentSelect}`);
    if (locationInput) query.push(`geoLocation.value=${locationInput}`);

    const url = `${baseUrl}/search?${query.join('&')}&hasImages=true`; // hasImages=true (include images)

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
    const objectIDs = objects.objectIDs ? objects.objectIDs.slice(0, 20) : []; // Get 20 first IDs

    totalPages = Math.ceil((objects.objectIDs ? objects.objectIDs.length : 0) / 20);

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
  const card = document.createElement('my-card');

  card.setAttribute('image-src', object.primaryImageSmall || './assets/no_image.jpg');
  card.setAttribute('image-alt', object.title || 'Imagen de obra de arte');
  card.setAttribute('object-date', object.objectDate || '');
  card.setAttribute('title', object.title || 'Sin título');
  card.setAttribute('culture', object.culture || 'Desconocida');
  card.setAttribute('dynasty', object.dynasty || 'Desconocida');

  if (object?.additionalImages && object.additionalImages.length > 0) {
    card.setAttribute('view-more', 'true');
    card.setAttribute('view-more-url', `/details.html?objectId=${object.objectID}`);
  }

  return card;
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
      fetchObjects();
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
    top: window.innerHeight - 240,
    behavior: 'smooth',
  });
}
