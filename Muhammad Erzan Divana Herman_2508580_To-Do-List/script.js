// ============================================================
// LOGIKA JAVASCRIPT DOM — APLIKASI TO-DO LIST HARIAN
// Mahasiswa : Muhammad Erzan Divana Herman (2508580)
// ============================================================

// 1. Seleksi Elemen DOM
const inputRencana = document.getElementById("input-rencana");
const btnSimpan = document.getElementById("btn-simpan");
const listRencana = document.getElementById("list-rencana");
const statusKosong = document.getElementById("status-kosong");
const notifikasiBox = document.getElementById("notifikasi-box");

// Elemen Rekap To-Do List
const rekapTotal = document.getElementById("rekap-total");
const rekapSelesai = document.getElementById("rekap-selesai");
const rekapBelum = document.getElementById("rekap-belum");
const persenSelesai = document.getElementById("persen-selesai");
const progressFill = document.getElementById("progress-fill");

console.log("Struktur dokumen siap. Sistem To-Do List diinisialisasi.");

// Variabel penampung timer pop-up
let timeoutNotifikasi;

// Fungsi untuk memunculkan pop-up notifikasi
function munculkanNotifikasi(pesan) {
  clearTimeout(timeoutNotifikasi);
  notifikasiBox.innerText = pesan;
  notifikasiBox.classList.remove("hidden");

  timeoutNotifikasi = setTimeout(function () {
    notifikasiBox.classList.add("hidden");
  }, 2500);
}

// Fungsi untuk memperbarui rekap to do list dan progres bar
function hitungRekapList() {
  const semuaBaris = listRencana.querySelectorAll(".item-row");
  const jumlahTotal = semuaBaris.length;
  const jumlahSelesai = listRencana.querySelectorAll(
    ".item-row.status-completed",
  ).length;
  const jumlahBelum = jumlahTotal - jumlahSelesai;

  // Update angka pada DOM
  rekapTotal.innerText = jumlahTotal;
  rekapSelesai.innerText = jumlahSelesai;
  rekapBelum.innerText = jumlahBelum;

  // Hitung persentase progres
  const persentase =
    jumlahTotal > 0 ? Math.round((jumlahSelesai / jumlahTotal) * 100) : 0;
  persenSelesai.innerText = persentase + "%";
  progressFill.style.width = persentase + "%";

  // Pengaturan tampilan jika daftar kosong
  if (jumlahTotal === 0) {
    statusKosong.classList.remove("hidden");
  } else {
    statusKosong.classList.add("hidden");
  }

  console.log(
    `Rekap To-Do List diperbarui: Total = ${jumlahTotal}, Selesai = ${jumlahSelesai}, Belum Selesai = ${jumlahBelum} (${persentase}%)`,
  );
}

// Fungsi utama menambah to do list baru
function tambahRencanaBaru() {
  const isiTeks = inputRencana.value.trim();

  // Validasi input kosong
  if (isiTeks === "") {
    alert(
      "To-Do List tidak boleh kosong. Mohon ketikkan to do list terlebih dahulu.",
    );
    console.log("Peringatan: Upaya menambahkan To-Do List kosong dicegah.");
    inputRencana.focus();
    return;
  }

  // Membuat node elemen li baru dengan kelas default 'status-pending' (merah)
  const barisBaru = document.createElement("li");
  barisBaru.className = "item-row status-pending";

  // Merakit komponen internal elemen li
  barisBaru.innerHTML = `
    <div class="row-content">
      <span class="pill-tag">Belum Selesai</span>
      <span class="row-title">${isiTeks}</span>
    </div>
    <div class="action-buttons">
      <button class="btn-status-toggle">Selesai</button>
      <button class="btn-remove-row">Hapus</button>
    </div>
  `;

  // Seleksi tombol di dalam elemen li baru
  const btnToggle = barisBaru.querySelector(".btn-status-toggle");
  const btnHapus = barisBaru.querySelector(".btn-remove-row");
  const pillTag = barisBaru.querySelector(".pill-tag");

  // Event handler untuk tombol Selesai / Batal
  btnToggle.addEventListener("click", function () {
    const sudahSelesai = barisBaru.classList.toggle("status-completed");

    if (sudahSelesai) {
      barisBaru.classList.remove("status-pending");
      btnToggle.innerText = "Batal";
      pillTag.innerText = "Selesai";
      munculkanNotifikasi(`To-Do List "${isiTeks}" berhasil diselesaikan!`);
      console.log(`Status To-Do List "${isiTeks}" diubah menjadi: Selesai`);
    } else {
      barisBaru.classList.add("status-pending");
      btnToggle.innerText = "Selesai";
      pillTag.innerText = "Belum Selesai";
      munculkanNotifikasi(`To-Do List "${isiTeks}" ditandai belum selesai.`);
      console.log(
        `Status To-Do List "${isiTeks}" diubah menjadi: Belum Selesai`,
      );
    }

    hitungRekapList();
  });

  // Event handler untuk tombol Hapus menggunakan remove()
  btnHapus.addEventListener("click", function () {
    barisBaru.remove();
    munculkanNotifikasi(`To-Do List "${isiTeks}" berhasil dihapus.`);
    console.log(`To-Do List "${isiTeks}" telah dihapus.`);

    hitungRekapList();
  });

  // Masukkan elemen baru ke dalam daftar utama
  listRencana.appendChild(barisBaru);
  munculkanNotifikasi("To-Do List baru berhasil ditambahkan!");
  console.log(`To-Do List baru berhasil ditambahkan: "${isiTeks}"`);

  // Reset input field
  inputRencana.value = "";
  inputRencana.focus();

  // Perbarui rekap tampilan
  hitungRekapList();
}

// Event Listener tombol simpan
btnSimpan.addEventListener("click", function () {
  tambahRencanaBaru();
});

// Event Listener tombol Enter
inputRencana.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    tambahRencanaBaru();
  }
});

// Jalankan kalkulasi awal saat dokumen dibuka
hitungRekapList();
