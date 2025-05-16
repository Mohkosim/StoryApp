import RegisterPresenter from './register-presenter';
import * as STORYAPI from '../../../data/api';
import * as AuthModel from '../../../utils/auth';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="register-container">
        <article class="register-form-container">
          <h1 class="register__title">Register</h1>

          <form id="register-form" class="register-form">
            <div class="form-control">
              <label for="name-input" class="register-form__name-title">Username</label>
              <div class="register-form__input-container">
                <input id="name-input" type="text" name="name" placeholder="John Doe" required />
              </div>
            </div>

            <div class="form-control">
              <label for="email-input" class="register-form__email-title">Email</label>
              <div class="register-form__input-container">
                <input id="email-input" type="email" name="email" placeholder="nama@email.com" required />
              </div>
            </div>

            <div class="form-control">
              <label for="password-input" class="register-form__password-title">Password</label>
              <div class="register-form__input-container">
                <input id="password-input" type="password" name="password" placeholder="Masukkan password" required />
              </div>
            </div>

            <div class="form-buttons register-form__form-buttons">
              <div id="submit-button-container">
                <button class="btn" type="submit">Daftar</button>
              </div>
              <p id="register-message" class="message" style="color: red;" aria-live="assertive"></p>
              <p class="register-form__have-account">Sudah punya akun? <a href="#/login">Login</a></p>
            </div>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: STORYAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };

      await this.#presenter.handleRegister(data);
    });
  }

  registerSuccessfully(message) {
    alert(message || 'Registrasi berhasil. Silakan login.');
    window.location.hash = '/login';
  }

  registerFailed(message) {
    const errorMessage = document.getElementById('register-message');
    errorMessage.textContent = message;
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Daftar
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Daftar</button>
    `;
  }
}
