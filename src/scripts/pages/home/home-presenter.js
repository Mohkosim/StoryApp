export default class HomePresenter {
  #view;
  #model;
  #dbModel;

  constructor({ view, model, dbModel }) {
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
  }

  async showMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showMap error:", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initStoriesAndMap() {
    this.#view.showLoading();

    try {
      await this.showMap();

      const response = await this.#model.getAllStories();
      if (!response.ok) {
        this.#view.populateStoriesListError(
          response.message || "Gagal memuat data."
        );
        return;
      }

      this.#view.populateStoriesList(response.message, response.list);
    } catch (error) {
      this.#view.populateStoriesListError(error.message);
      console.error("initStoriesAndMap:", error);
    } finally {
      this.#view.hideLoading();
    }
  }

  async saveReport(id) {
    try {
      const response = await this.#view.getReportById(id, this.#model);

      if (!response || !response.ok || !response.data) {
        throw new Error("Gagal mengambil data cerita.");
      }

      const report = response.data;

      // Validasi ID sebelum simpan
      if (!report.id) {
        throw new Error("Data tidak memiliki ID, tidak bisa disimpan.");
      }

      await this.#dbModel.putReport(report);
      this.#view.saveToBookmarkSuccessfully("Berhasil disimpan ke bookmark");
    } catch (error) {
      console.error("saveReport: error:", error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }
}
