export default class NotFoundPage {
  async render() {
    return `
      <section class="not-found">
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
        <a href="#/" class="back-home">Kembali ke Beranda</a>
      </section>
    `;
  }

  async afterRender() {
    const backHomeLink = document.querySelector(".back-home");

    backHomeLink.addEventListener("click", (event) => {
      event.preventDefault();

      // Tambahkan efek animasi sebelum berpindah halaman
      document.body.classList.add("fade-out");

      // Tunggu animasi lalu pindah halaman
      setTimeout(() => {
        location.hash = "/";
      }); // Sesuai durasi animasi CSS
    });
  }
}

