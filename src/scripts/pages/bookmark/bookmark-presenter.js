export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  

  async initialGalleryAndMap() {
    try {
      const listOfReports = await this.#model.getAllReports();
      const reports = await Promise.all(listOfReports.map(reportMapper));

      const message = 'Berhasil mendapatkan daftar story map tersimpan.';
      this.#view.populateBookmarkedReports(message, reports);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateBookmarkedReportsError(error.message);
    }
  }

  async removeReport(reportId) {
  try {
    await this.#model.removeReport(reportId);
    this.#view.removeFromBookmarkSuccessfully('Berhasil menghapus bookmark.');
    await this.initialGalleryAndMap();
  } catch (error) {
    console.error('removeReport: error:', error);
    this.#view.removeFromBookmarkFailed(error.message);
  }
}

}

function reportMapper(report) {
  return {
    id: report.id,
    name: report.name || 'Tanpa Nama',
    description: report.description,
    photoUrl: report.photoUrl,
    createdAt: report.createdAt || new Date().toISOString(),
    lat: report.lat,
    lon: report.lon,
  };
}

