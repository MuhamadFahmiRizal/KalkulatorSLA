"use client";
import { useState } from "react";

function hitungDowntime(masuk: string, keluar: string) {
  if (!masuk || !keluar) return { detik: 0, jamDesimal: 0 };

  const [jm, mm, dm] = masuk.split(":").map(Number);
  const [jk, mk, dk] = keluar.split(":").map(Number);

  const masukDetik = jm * 3600 + mm * 60 + dm;
  const keluarDetik = jk * 3600 + mk * 60 + dk;

  let selisihDetik = keluarDetik - masukDetik;
  if (selisihDetik < 0) selisihDetik += 24 * 3600;

  return {
    detik: selisihDetik,
    jamDesimal: selisihDetik / 3600,
  };
}

export default function Home() {
  /* ======================
     INPUT STATE
  ====================== */
  const [sla, setSla] = useState("99.5");
  const [hari, setHari] = useState("30");
  const [biaya, setBiaya] = useState("3000000");

  const [masuk, setMasuk] = useState("13:12:00");
  const [keluar, setKeluar] = useState("16:36:00");

  /* ======================
     KONVERSI KE NUMBER
  ====================== */
  const slaNum = Number(sla);
  const hariNum = Number(hari);
  const biayaNum = Number(biaya);

  const { detik, jamDesimal } = hitungDowntime(masuk, keluar);
  const totalJam = 24 * hariNum;
  const restitusi =
    totalJam > 0 ? (jamDesimal / totalJam) * biayaNum : 0;

  const jam = Math.floor(detik / 3600);
  const menit = Math.floor((detik % 3600) / 60);
  const detikSisa = detik % 60;

  /* ======================
     DOWNTIME MAKSIMUM SLA
  ====================== */
  const maxDowntimeJam =
    ((100 - slaNum) / 100) * (24 * hariNum);

  const maxDowntimeDetik = Math.floor(maxDowntimeJam * 3600);

  const maxJam = Math.floor(maxDowntimeDetik / 3600);
  const maxMenit = Math.floor((maxDowntimeDetik % 3600) / 60);
  const maxDetik = maxDowntimeDetik % 60;

  return (
    <main className="page">
      <div className="card">
        <h1 className="title">Kalkulator SLA Internet</h1>
        <p className="subtitle">
          Perhitungan downtime dan restitusi layanan jaringan
        </p>

        {/* ================= PARAMETER SLA ================= */}
        <section className="section">
          <h3 className="section-title">Parameter SLA</h3>

          <div className="form-table three-col">
            <div className="form-group">
              <label>SLA (%)</label>
              <input
                type="number"
                step="0.1"
                value={sla}
                onChange={(e) => setSla(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Jumlah Hari</label>
              <input
                type="number"
                value={hari}
                onChange={(e) => setHari(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Biaya Bulanan (Rp)</label>
              <input
                type="number"
                value={biaya}
                onChange={(e) => setBiaya(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ================= WAKTU DOWNTIME ================= */}
        <section className="section">
          <h3 className="section-title">Waktu Downtime</h3>

          <div className="form-table two-col">
            <div className="form-group">
              <label>Waktu gangguan koneksi per bulan</label>
              <input
                type="time"
                step="1"
                value={keluar}
                onChange={(e) => setKeluar(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Waktu gangguan yang diperbolehkan</label>
              <input
                type="time"
                step="1"
                value={masuk}
                onChange={(e) => setMasuk(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ================= HASIL ================= */}
        <section className="result-box">
          <p>
            <b>Rumus SLA:</b><br />
            <span className="formula">
              (100% − {slaNum}%) / 100% × (24 jam × {hariNum} hari)
            </span>
          </p>

          <p>
            <b>Waktu gangguan per bulan:</b>{" "}
            {jam} Jam {menit} Menit {detikSisa} Detik
          </p>

          <hr />

          <p><b>Rumus Restitusi:</b></p>

          <div className="formula-inline">
            <span className="time">{keluar}</span>
            <span className="operator">−</span>
            <span className="time">{masuk}</span>
            <span className="operator">/</span>
            <span className="denominator">24 × {hariNum}</span>
            <span className="operator">×</span>
            <span className="money">
              Rp {biayaNum.toLocaleString("id-ID")}
            </span>
          </div>

          <p>
            <b>Waktu gangguan yang diperbolehkan:</b>{" "}
            {maxJam} Jam {maxMenit} Menit {maxDetik} Detik
          </p>

          <p className="restitusi">
            Restitusi: Rp {Math.round(restitusi).toLocaleString("id-ID")}
          </p>
        </section>
      </div>
    </main>
  );
}
