import { getActiveRoute } from "../routes/url-parser";
import {
  generateAuthenticatedNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate,
  generateMainNavigationListTemplate,
} from "../templates";
import { isServiceWorkerAvailable, setupSkipToContent } from "../utils";
import { getAccessToken, getLogout } from "../utils/auth";
import routes, { fallbackRoute } from "../routes/routes";
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from "../utils/notification-helper";

export default class App {
  #content;
  #drawerButton;
  #drawerNavigation;
  #skipLinkButton;
  #currentPage;

  constructor({ content, drawerNavigation, drawerButton, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
    this.#setupNavigationList();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#drawerNavigation.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(
        event.target
      );
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation.classList.remove("open");
      }

      this.#drawerNavigation.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove("open");
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain =
      this.#drawerNavigation.children.namedItem("navlist-main");
    const navList = this.#drawerNavigation.children.namedItem("navlist");

    if (!isLogin) {
      navListMain.innerHTML = "";
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    // Tampilkan navigasi utama (Daftar Laporan dan Bookmark)
    navListMain.innerHTML = generateMainNavigationListTemplate();

    // Tampilkan navigasi akun (Logout, dll.)
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (confirm("Apakah Anda yakin ingin keluar?")) {
        getLogout();

        location.hash = "/login";
      }
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById(
      "push-notification-tools"
    );
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document
        .getElementById("unsubscribe-button")
        .addEventListener("click", () => {
          unsubscribe().finally(() => {
            this.#setupPushNotification();
          });
        });

      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document
      .getElementById("subscribe-button")
      .addEventListener("click", () => {
        subscribe().finally(() => {
          this.#setupPushNotification();
        });
      });
  }

  async renderPage() {
    if (this.#currentPage && typeof this.#currentPage.destroy === "function") {
      this.#currentPage.destroy();
    }

    const url = getActiveRoute();
    const isLoggedIn = !!getAccessToken();
    const publicRoutes = ["/login", "/register"];
    const route = routes[url] ?? fallbackRoute; 

    if (!isLoggedIn && !publicRoutes.includes(url)) {
      window.location.hash = "/login";
      return;
    }

    // Jika sudah login tapi membuka login/register
    if (isLoggedIn && publicRoutes.includes(url)) {
      window.location.hash = "/";
      return;
    }

    const page = route();
    this.#currentPage = page;

    this.#setupNavigationList();

    // View Transition API
    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }

    if (isServiceWorkerAvailable()) {
      this.#setupPushNotification();
    }
    scrollTo({ top: 0, behavior: "smooth" });
  }
}
