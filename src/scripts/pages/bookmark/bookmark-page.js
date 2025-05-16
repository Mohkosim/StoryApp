import {
  generateLoaderAbsoluteTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from "../../templates";

import * as StoryAPI from "../../data/api";
import BookmarkPresenter from "./bookmark-presenter";
import Map from "../../utils/map.js";
import Database from "../../data/database";

export default class BookmarkPage {
  #presenter;
  #map = null;

  async render() {
    return `
      <section class="bookmark">
        <div class="bookmark-page">
          <h1>Daftar Story Tersimpan</h1>
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
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    try {
      this.showLoading();
      this.showMapLoading();

      await this.initMap();
      await this.#presenter.initialGalleryAndMap();
    } catch (error) {
      this.populateStoriesListError(error.message || "Unknown error");
    } finally {
      this.hideLoading();
      this.hideMapLoading();
    }
  }

  showLoading() {
    document.getElementById("loader").style.display = "block";
    document.getElementById("story-list").innerHTML = "";
  }

  hideLoading() {
    document.getElementById("loader").style.display = "none";
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  async initMap() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.#map = await Map.build("#map-inner", {
      locate: true,
      zoom: 5,
    });
  }

  populateBookmarkedReports(_, reports) {
    const container = document.getElementById("story-list");

    if (!reports || !reports.length) {
      this.populateStoriesListEmpty();
      return;
    }

    container.innerHTML = reports
      .map(
        (report) => `
    <article class="story-card">
      <img src="${report.photoUrl}" alt="Photo of ${report.name}" />
      <div class="report-info">
        <h3>${report.name}</h3>
        <p>${report.description}</p>
        <p><strong>Created At:</strong> ${new Date(
          report.createdAt
        ).toLocaleString()}</p>
        <button class="story-remove-button" data-id="${
          report.id
        }">Hapus Tersimpan</button>
      </div>
    </article>
  `
      )
      .join("");

    document.querySelectorAll(".story-remove-button").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        await this.#presenter.removeReport(id);
      });
    });

    if (this.#map) {
      reports.forEach((report) => {
        if (report.lat && report.lon) {
          this.#map.addMarker(
            [report.lat, report.lon],
            {},
            {
              content: `<b>${report.name}</b><br>${report.description || ""}`,
            }
          );
        }
      });
    }
  }

  populateStoriesListEmpty() {
    document.getElementById("story-list").innerHTML =
      generateReportsListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById("story-list").innerHTML =
      generateReportsListErrorTemplate(message);
  }

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }

  removeFromBookmarkFailed(message) {
    alert(`Gagal menghapus bookmark: ${message}`);
  }
}
