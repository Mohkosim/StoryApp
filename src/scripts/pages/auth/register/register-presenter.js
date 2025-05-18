export default class RegisterPresenter {
    #view;
    #model;
    #authModel;
  
    constructor({ view, model, authModel }) {
      this.#view = view;
      this.#model = model;
      this.#authModel = authModel;
    }
  
    async handleRegister({ name, email, password }) {
      this.#view.showSubmitLoadingButton();
      try {
        const response = await this.#model.registerUser({ name, email, password });
  
        if (!response || response.error) {
          this.#view.registerFailed(response?.message || 'Gagal melakukan registrasi.');
          return;
        }
  
        this.#view.registerSuccessfully(response.message);
      } catch (error) {
        this.#view.registerFailed('Terjadi kesalahan. Silakan coba lagi.');
      } finally {
        this.#view.hideSubmitLoadingButton();
      }
    }
  }
  