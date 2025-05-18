export default class AddPresenter {
  #view;
  #model;
  #apiModel;
  #reportId;

  constructor({ view, model, apiModel = null, reportId = null }) {
    this.#view = view;
    this.#model = model;
    this.#apiModel = apiModel;
    this.#reportId = reportId;
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

  async notifyMe() {
    try {
      const response = await this.#apiModel.sendReportToMeViaNotification(this.#reportId);
      if (!response.ok) {
        console.error('notifyMe: response:', response);
        return;
      }
      console.log('notifyMe:', response.message);
    } catch (error) {
      console.error('notifyMe: error:', error);
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
