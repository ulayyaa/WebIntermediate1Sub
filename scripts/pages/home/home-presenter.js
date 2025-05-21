export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showstoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showstoriesListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showstoriesListMap();

      const response = await this.#model.getAllStories();

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populatestoriesListError(response.message);
        return;
      }

      this.#view.populatestoriesList(response.message, response.data);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populatestoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
