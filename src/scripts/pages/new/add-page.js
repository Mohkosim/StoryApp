import AddPresenter from "./add-presenter";
import { convertBase64ToBlob } from "../../utils";
import * as StoryAPI from "../../data/api";

export default class AddPage {
  #presenter;
  #form;
  #capturedImageBlob;
  #map;
  #mapMarker;
  #videoStream;

  async render() {
    return `
      <section class="add-story">
        <form id="addStoryForm" aria-label="Form tambah story" role="form">
          <h2 tabindex="0">Tambah Story</h2>

          <div class="form-control">
            <label for="photo">Pilih Foto dari Galeri</label>
            <input id="photo" type="file" name="photo" accept="image/*" />
          </div>

          <div class="form-control">
            <p>Atau ambil langsung dari kamera:</p>
            <video id="cameraPreview" autoplay playsinline width="300" height="200" style="border:1px solid #ccc;"></video>
            <div style="margin-top: 0.5rem;">
              <button type="button" id="startCameraButton">Aktifkan Kamera</button>
              <button type="button" id="captureButton">Ambil Foto</button>
              <button type="button" id="stopCameraButton">Matikan Kamera</button>
            </div>
          </div>

          <div class="form-control">
            <label>Preview:</label>
            <img id="photoPreview" src="" alt="Preview foto" style="display:none; width:300px; border:1px solid #ccc;" />
          </div>

          <div class="form-control">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required placeholder="Tuliskan deskripsi story di sini"></textarea>
          </div>

          <div class="form-control">
            <label>Map</label>
            <div id="map" style="height: 300px; margin: 1rem 0;"></div>
            <div class="new-form__location__lat-lng">
              <input type="number" name="latitude" value="-6.175389" disabled>
              <input type="number" name="longitude" value="106.827139" disabled>
            </div>
            <button type="button" id="myLocationButton">Gunakan Lokasi Saya</button>
          </div>

          <button type="submit">Kirim</button>
          <p id="add-message" style="color:red;" aria-live="assertive"></p>
        </form>
        
        <canvas id="canvas" style="display:none;"></canvas>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddPresenter({ view: this, model: StoryAPI });
    this.#setupForm();
    this.#setupCamera();
    this.#setupLocation();
    this.addNotifyMeEventListener();

    if (currentPage?.destroy) {
      currentPage.destroy();
    }
  }

  destroy() {
    if (this.#videoStream) {
      this.#videoStream.getTracks().forEach((track) => track.stop());
      this.#videoStream = null;
    }

    if (this.#map) {
      this.#map.remove();
      this.#map = null;
    }
  }

  addNotifyMeEventListener() {
    const notifyButton = document.getElementById("add-notify-me-button");
    if (notifyButton) {
      notifyButton.addEventListener("click", () => {
        this.#presenter.notifyMe();
      });
    }
  }

  async #setupForm() {
    this.#form = document.getElementById("addStoryForm");
    const message = document.getElementById("add-message");
    const preview = document.getElementById("photoPreview");

    this.#form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = document.getElementById("description").value;

      if (!this.#capturedImageBlob) {
        message.textContent = "Harap pilih atau ambil foto terlebih dahulu.";
        return;
      }

      if (this.latitude === undefined || this.longitude === undefined) {
        message.textContent = "Harap izinkan akses lokasi untuk melanjutkan.";
        return;
      }

      const formData = new FormData();
      formData.append("photo", this.#capturedImageBlob);
      formData.append("description", description);
      formData.append("lat", this.latitude);
      formData.append("lon", this.longitude);

      try {
        await this.#presenter.addStory(formData);
        message.style.color = "green";
        message.textContent = "Story berhasil ditambahkan!";
        this.#form.reset();
        preview.src = "";
        preview.style.display = "none";

        if (this.#videoStream) {
          this.#videoStream.getTracks().forEach((track) => track.stop());
          this.#videoStream = null;
        }

        setTimeout(() => {
          location.hash = "/";
        }, 1000);
      } catch (err) {
        message.style.color = "red";
        message.textContent = `Gagal menambahkan story: ${err.message}`;
      }
    });
  }

  #setupCamera() {
    const video = document.getElementById("cameraPreview");
    const canvas = document.getElementById("canvas");
    const captureButton = document.getElementById("captureButton");
    const preview = document.getElementById("photoPreview");
    const startCameraButton = document.getElementById("startCameraButton");
    const stopCameraButton = document.getElementById("stopCameraButton");

    const startCamera = async () => {
      try {
        this.#videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        video.srcObject = this.#videoStream;
      } catch (err) {
        console.error("Gagal mengakses kamera:", err);
        alert("Tidak dapat mengakses kamera. Periksa izin di browser.");
      }
    };

    const stopCamera = () => {
      if (this.#videoStream) {
        this.#videoStream.getTracks().forEach((track) => track.stop());
        this.#videoStream = null;
        video.srcObject = null;
      }
    };

    startCameraButton.addEventListener("click", startCamera);
    stopCameraButton.addEventListener("click", stopCamera);

    captureButton.addEventListener("click", () => {
      if (!this.#videoStream) {
        alert("Kamera belum aktif.");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        this.#capturedImageBlob = blob;
        preview.src = URL.createObjectURL(blob);
        preview.style.display = "block";

        stopCamera(); // Kamera dimatikan setelah ambil foto
      });
    });
  }

  #setupLocation() {
    this.#map = L.map("map").setView([-6.2, 106.816666], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.#map);

    const latInput = document.querySelector('input[name="latitude"]');
    const lonInput = document.querySelector('input[name="longitude"]');

    this.latitude = parseFloat(latInput.value);
    this.longitude = parseFloat(lonInput.value);

    this.#mapMarker = L.marker([this.latitude, this.longitude])
      .addTo(this.#map)
      .bindPopup("Lokasi Default")
      .openPopup();

    this.#map.on("click", (e) => {
      this.latitude = e.latlng.lat;
      this.longitude = e.latlng.lng;

      latInput.value = this.latitude;
      lonInput.value = this.longitude;

      if (this.#mapMarker) {
        this.#map.removeLayer(this.#mapMarker);
      }

      this.#mapMarker = L.marker([this.latitude, this.longitude])
        .addTo(this.#map)
        .bindPopup("Lokasi dipilih")
        .openPopup();
    });

    document
      .getElementById("myLocationButton")
      .addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.latitude = pos.coords.latitude;
            this.longitude = pos.coords.longitude;

            latInput.value = this.latitude;
            lonInput.value = this.longitude;

            const userLatLng = [this.latitude, this.longitude];
            this.#map.setView(userLatLng, 15);

            if (this.#mapMarker) {
              this.#map.removeLayer(this.#mapMarker);
            }

            this.#mapMarker = L.marker(userLatLng)
              .addTo(this.#map)
              .bindPopup("Lokasi Anda")
              .openPopup();
          },
          (err) => {
            console.error("Gagal mendapatkan lokasi:", err);
            alert(
              "Tidak dapat mengambil lokasi. Harap izinkan akses lokasi di browser."
            );
          }
        );
      });
  }
}
