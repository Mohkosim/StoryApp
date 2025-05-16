export function generateLoaderTemplate() {
  return `<div class="loader">Loading...</div>`;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute">
      <span class="spinner"></span>
      <span>Loading...</span>
    </div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="report-list-button" class="report-list-button" href="#/">Daftar Story</a></li>
    <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Story Tersimpan</a></li>
  `;
}

export function generateReportsListEmptyTemplate() {
  return `<p class="empty-message">Tidak ada story tersimpan.</p>`;
}

export function generateReportsListErrorTemplate(message) {
  return `<p class="error-message">Gagal memuat data: ${message}</p>`;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li><a id="new-report-button" class="new-story-button" href="#/new">Add Story <i class="fas fa-plus"></i></a></li>
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="logout-button" href="#/logout"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

  
export function generateAddNotifyMeButtonTemplate() {
  return `
    <button id="add-notify-me-button" class="btn btn-transparent">
      Aktifkan Notifikasi <i class="fas fa-bell"></i>
    </button>
  `;
}