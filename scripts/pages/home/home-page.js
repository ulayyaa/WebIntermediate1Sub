import {
  generateLoaderAbsoluteTemplate,
  generatestoryItemTemplate,
  generatestoriesListEmptyTemplate,
  generatestoriesListErrorTemplate,
} from '../../templates';
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as DicodingLoveStory from '../../data/api';

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="stories-list__map__container">
          <div id="map" class="stories-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Story</h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: DicodingLoveStory,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populatestoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populatestoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
       if (this.#map) {
      const coordinate = [storylocation.latitude, story.location.longitude];
      const markerOptions = { alt: story.title };
      const popupOptions = { content: story.title };
      this.#map.addMarker(coordinate, markerOptions, popupOptions);
    }
      return accumulator.concat(
        generatestoryItemTemplate({
          ...story,
          storyerName: story.storyer.name,
        }),
      );
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populatestoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generatestoriesListEmptyTemplate();
  }

  populatestoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generatestoriesListErrorTemplate(message);
  }

  async initialMap() {
  this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}
