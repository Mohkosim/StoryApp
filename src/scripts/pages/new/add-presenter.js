export default class AddPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async addStory(formData) {
    try {
      const response = await this.#model.addStory(formData);

      if (!response.ok) {
        throw new Error(response.message || "Gagal mengirim story");
      }

      return response;
    } catch (error) {
      console.error('AddPresenter error:', error);
      throw error;
    }
  }

  async #notifyToAllUser(reportId) {
    try {
      const response = await this.#model.sendReportToAllUserViaNotification(reportId);
      if (!response.ok) {
        console.error('#notifyToAllUser: response:', response);
        return false;
      }
      return true;
    } catch (error) {
      console.error('#notifyToAllUser: error:', error);
      return false;
    }
  }
}
