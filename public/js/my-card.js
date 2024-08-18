class MyCard extends HTMLElement {
  static get observedAttributes() {
    return [
      'image-src',
      'image-alt',
      'object-date',
      'title',
      'culture',
      'dynasty',
      'view-more',
      'view-more-url',
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = '';

    const styleLink = document.createElement('link');
    styleLink.setAttribute('rel', 'stylesheet');
    styleLink.setAttribute(
      'href',
      'https://cdn.jsdelivr.net/npm/uikit@3.21.9/dist/css/uikit.min.css'
    );

    const card = document.createElement('div');
    card.setAttribute('class', 'uk-card uk-card-default uk-border-rounded');

    const mediaTop = document.createElement('div');
    mediaTop.setAttribute('class', 'uk-card-media-top');

    const img = document.createElement('img');
    img.src = this.getAttribute('image-src') || './assets/no_image.jpg';
    img.alt = this.getAttribute('image-alt') || 'Imagen de obra de arte';
    img.setAttribute('uk-tooltip', `title: ${this.getAttribute('object-date') || ''}; delay: 350`);

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'uk-card-body');

    const title = document.createElement('h3');
    title.setAttribute('class', 'uk-text-default uk-text-bold');
    title.textContent = this.getAttribute('title') || 'Sin título';

    const culture = document.createElement('p');
    culture.setAttribute('class', 'uk-text-small');
    culture.textContent = `Cultura: ${this.getAttribute('culture') || 'Desconocida'}`;

    const dynasty = document.createElement('p');
    dynasty.setAttribute('class', 'uk-text-small');
    dynasty.textContent = `Dinastía: ${this.getAttribute('dynasty') || 'Desconocida'}`;

    mediaTop.appendChild(img);
    cardBody.appendChild(title);
    cardBody.appendChild(culture);
    cardBody.appendChild(dynasty);

    if (this.hasAttribute('view-more') && this.getAttribute('view-more') === 'true') {
      const viewMoreImages = document.createElement('a');
      viewMoreImages.setAttribute('class', 'uk-button uk-button-default uk-border-rounded card');
      viewMoreImages.setAttribute('href', this.getAttribute('view-more-url'));
      viewMoreImages.textContent = 'VER MÁS IMÁGENES';

      cardBody.appendChild(viewMoreImages);
    }

    card.appendChild(mediaTop);
    card.appendChild(cardBody);

    shadow.appendChild(styleLink);
    shadow.appendChild(card);
  }
}

customElements.define('my-card', MyCard);
