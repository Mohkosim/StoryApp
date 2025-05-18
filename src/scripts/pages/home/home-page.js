import HomePresenter from "./home-presenter";
import * as StoryAPI from "../../data/api";
import {
  generateLoaderAbsoluteTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from "../../templates";
import Map from "../../utils/map.js";
import Database from "../../data/database";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="home">
        <div class="home-page">
          <h1>Home Page</h1>
        </div>

        <div class="loader" id="loader">Loading...</div>

        <div id="story-map" class="story-map">
          <div id="map-loading-container"></div>
          <div id="map-inner" style="height: 100%; width: 100%;"></div>
        </div>

        <div id="story-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
      dbModel: Database,
    });

    try {
      this.showLoading();
      this.showMapLoading();

      await this.initialMap();
      await this.#presenter.initStoriesAndMap();
    } catch (error) {
      this.populateStoriesListError(error.message || "Unknown error");
    } finally {
      this.hideLoading();
      this.hideMapLoading();
    }
  }

  showLoading() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "block";
    const list = document.getElementById("story-list");
    if (list) list.innerHTML = "";
  }

  hideLoading() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  }

  showError(message) {
    const loader = document.getElementById("loader");
    if (loader) loader.innerText = message;
  }

  populateStoriesList(_, stories) {
    const container = document.getElementById("story-list");
    if (!stories || !stories.length) {
      this.populateStoriesListEmpty();
      return;
    }

    container.innerHTML = stories
      .map(
        (story) => `
        <article class="story-card">
          <img src="${story.photoUrl}" alt="Photo of ${story.name}" />
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <p><strong>Created At:</strong> ${new Date(
            story.createdAt
          ).toLocaleString()}</p>
          <button class="story-save-button" data-id="${story.id}">Simpan</button>
        </article>
      `
      )
      .join("");

    // Event listener untuk semua tombol simpan
    document.querySelectorAll(".story-save-button").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        await this.#presenter.saveReport(id);
      });
    });

    // Tambahkan marker ke map
    if (this.#map) {
      stories.forEach((story) => {
        if (story.lat && story.lon) {
          this.#map.addMarker(
            [story.lat, story.lon],
            {},
            {
              content: `<b>${story.name}</b><br>${story.description}`,
            }
          );
        }
      });
    }
  }

  getReportById(id, model) {
  return model.getStory(id);
}


  populateStoriesListEmpty() {
    document.getElementById("story-list").innerHTML =
      generateReportsListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById("story-list").innerHTML =
      generateReportsListErrorTemplate(message);
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  async initialMap() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.#map = await Map.build("#map-inner", {
      locate: true,
      zoom: 5,
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
  }
}
