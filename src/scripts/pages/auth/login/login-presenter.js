export default class LoginPresenter {
    #view;
    #model;
    #authModel;
  
    constructor({ view, model, authModel }) {
      this.#view = view;
      this.#model = model;
      this.#authModel = authModel;
    }
  
    async getLogin({ email, password }) {
      this.#view.showSubmitLoadingButton();
      try {
        const response = await this.#model.loginUser({ email, password });
  
        if (!response.ok) {
          this.#view.loginFailed(response.message);
          return;
        }
  
        this.#authModel.putAccessToken(response.loginResult.token);
  
        this.#view.loginSuccessfully(response.message);
      } catch (error) {
        this.#view.loginFailed('Terjadi kesalahan. Silakan coba lagi.');
      } finally {
        this.#view.hideSubmitLoadingButton();
      }
    }
  }
  