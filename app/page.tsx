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
  const [sla, setSla] = useState<string>("99.5");
  const [hari, setHari] = useState<string>("30");
  const [biaya, setBiaya] = useState<string>("3000000");

  const [masuk, setMasuk] = useState("13:12:00");
  const [keluar, setKeluar] = useState("16:36:00");

  /* ======================
     KONVERSI KE NUMBER
  ====================== */
  const slaNum = Number(sla || 0);
  const hariNum = Number(hari || 0);
  const biayaNum = Number(biaya || 0);

  const { detik, jamDesimal } = hitungDowntime(masuk, keluar);
  const totalJam = 24 * hariNum;
  const restitusi =
    totalJam > 0 ? (jamDesimal / totalJam) * biayaNum : 0;

  const jam = Math.floor(detik / 3600);
  const menit = Math.floor((detik % 3600) / 60);
  const detikSisa = detik % 60;

  /*======================
   DOWNTIME MAKSIMUM SLA (VERSI PRAKTIS)
   RUMUS:
   (100 - SLA) / 100 × (24 jam × jumlah hari)
  =======================*/

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

        <section className="section">
          <h3 className="section-title">Waktu Downtime</h3>

          <div className="form-table two-col">
        
            <div className="form-group">
              <label>Waktu gangguan koneksi per-bulan</label>
              <input
                type="time"
                step="1"
                value={keluar}
                onChange={(e) => setKeluar(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Waktu gangguan koneksi yang diperbolehkan per-bulan</label>
              <input
                type="time"
                step="1"
                value={masuk}
                onChange={(e) => setMasuk(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="result-box">
          <p>
            <b>Rumus SLA:</b><br />
            <span className="formula">
              (100% − {slaNum}%) / 100% × (24 jam × {hariNum} hari)
            </span>
          </p>
          <p>
            <b>waktu gangguan per bulan:</b> {jam} Jam {menit} Menit {detikSisa} Detik
          </p>
          <hr />

<p><b>Rumus Restitusi (Input):</b></p>

<div className="formula-box">
  <div className="formula-fraction">
    <div className="top">
      <span className="time">{keluar}</span>
      <span className="operator">−</span>
      <span className="time">{masuk}</span>
      <span classname="formula">/ 24 × {hariNum}</span>
      <span className="operator">×</span>
      <span className="money">
        Rp {biayaNum.toLocaleString("id-ID")}
      </span>
    </div>

    <div className="line"></div>

    <div className="bottom">
      24 × {hariNum}
    </div>
  </div>
</div>
          
          <p>
            <b>waktu gangguan yang diperbolehkan per bulan(SLA):</b>{" "}
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
