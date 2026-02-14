// =====================================
// DATA STORAGE
// =====================================
let data = JSON.parse(localStorage.getItem("jptData")) || [];

function simpanData() {
  localStorage.setItem("jptData", JSON.stringify(data));
}

// =====================================
// FORMAT RUPIAH
// =====================================
function formatRupiah(angka) {
  return angka.toLocaleString("id-ID");
}

// =====================================
// RENDER TABLE + TOTAL
// =====================================
function renderData() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  let totalMasuk = 0;
  let totalKeluar = 0;

  data.forEach((item, index) => {
    const total = item.jumlahUnit * item.hargaUnit;

    if (item.jenis === "Pemasukan") {
      totalMasuk += total;
    } else {
      totalKeluar += total;
    }

    tbody.innerHTML += `
      <tr>
        <td>${item.tanggal}</td>
        <td>${item.namaItem}</td>
        <td>${item.jumlahUnit}</td>
        <td>Rp ${formatRupiah(item.hargaUnit)}</td>
        <td><strong>Rp ${formatRupiah(total)}</strong></td>
        <td>${item.jenis}</td>
        <td>
          <button onclick="hapusData(${index})">X</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("totalMasuk").textContent =
    "Rp " + formatRupiah(totalMasuk);

  document.getElementById("totalKeluar").textContent =
    "Rp " + formatRupiah(totalKeluar);

  document.getElementById("saldoAkhir").textContent =
    "Rp " + formatRupiah(totalMasuk - totalKeluar);
}

// =====================================
// TAMBAH DATA
// =====================================
function tambahData() {
  const tanggal = document.getElementById("tanggal").value;
  const namaItem = document.getElementById("namaItem").value;
  const jumlahUnit = parseInt(document.getElementById("jumlahUnit").value);
  const hargaUnit = parseInt(document.getElementById("hargaUnit").value);
  const jenis = document.getElementById("jenis").value;
  const keterangan = document.getElementById("keterangan").value;

  if (!tanggal || !namaItem || !jumlahUnit || !hargaUnit) {
    alert("Lengkapi semua data terlebih dahulu!");
    return;
  }

  const newData = {
    tanggal,
    namaItem,
    jumlahUnit,
    hargaUnit,
    jenis,
    keterangan
  };

  data.push(newData);
  simpanData();
  renderData();

  // Reset form
  document.getElementById("namaItem").value = "";
  document.getElementById("jumlahUnit").value = "";
  document.getElementById("hargaUnit").value = "";
  document.getElementById("keterangan").value = "";
}

// =====================================
// HAPUS DATA
// =====================================
function hapusData(index) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    data.splice(index, 1);
    simpanData();
    renderData();
  }
}

// =====================================
// EXPORT PDF + TOTAL RINGKASAN
// =====================================
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let totalMasuk = 0;
  let totalKeluar = 0;

  data.forEach(item => {
    const total = item.jumlahUnit * item.hargaUnit;
    if (item.jenis === "Pemasukan") {
      totalMasuk += total;
    } else {
      totalKeluar += total;
    }
  });

  doc.setFontSize(14);
  doc.text("PT. JPT - Laporan Keuangan", 14, 15);

  const rows = data.map(item => [
    item.tanggal,
    item.namaItem,
    item.jumlahUnit,
    "Rp " + formatRupiah(item.hargaUnit),
    "Rp " + formatRupiah(item.jumlahUnit * item.hargaUnit),
    item.jenis
  ]);

  doc.autoTable({
    head: [["Tanggal", "Item", "Unit", "Harga", "Total", "Jenis"]],
    body: rows,
    startY: 20
  });

  // =============================
  // POSISI RINGKASAN MANUAL
  // =============================
  let posisiY = 20 + (rows.length * 8) + 20;

  doc.setFontSize(12);
  doc.text("Total Pemasukan: Rp " + formatRupiah(totalMasuk), 14, posisiY);
  doc.text("Total Pengeluaran: Rp " + formatRupiah(totalKeluar), 14, posisiY + 8);
  doc.setFont(undefined, "bold");
  doc.text("Saldo Akhir: Rp " + formatRupiah(totalMasuk - totalKeluar), 14, posisiY + 16);

  doc.save("laporan-keuangan-jpt.pdf");
}

