import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Class Diagram Database - Sistem Pakar Troubleshooting Mesin</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px;
      color: #000000;
    }
    .header {
      text-align: center;
      margin-bottom: 25px;
    }
    .header h1 {
      font-size: 20px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .header p {
      font-size: 13px;
      color: #444;
    }
    .diagram-container {
      background: #ffffff;
      padding: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    svg {
      display: block;
    }
    .tbl-title {
      font-size: 13px;
      font-weight: bold;
      text-anchor: middle;
      font-family: Arial, sans-serif;
    }
    .pk-label {
      font-size: 11px;
      font-weight: bold;
      text-anchor: middle;
      font-family: Arial, sans-serif;
    }
    .attr-text {
      font-size: 11px;
      font-family: Arial, sans-serif;
    }
    .fk-text {
      font-size: 10.5px;
      font-family: Arial, sans-serif;
    }
    .pk-underlined {
      text-decoration: underline;
      font-weight: bold;
    }
    @media print {
      body {
        padding: 0;
      }
      .diagram-container {
        border: none;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>CLASS DIAGRAM DATABASE (RELATIONAL MODEL 3NF)</h1>
    <p>Sistem Pakar Troubleshooting Mesin Produksi &bull; PT Vivo Mobile Indonesia</p>
  </div>

  <div class="diagram-container">
    <svg width="1540" height="980" viewBox="0 0 1540 980" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Arrowhead Marker -->
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
        </marker>
      </defs>

      <!-- ======================================================== -->
      <!-- RELATIONSHIP CONNECTOR LINES                             -->
      <!-- ======================================================== -->
      <g stroke="#000000" stroke-width="1.3" fill="none">
        
        <!-- 1. tb_user to tb_diagnosa (via id_user) -->
        <!-- tb_user bottom-right (350, 160) -> tb_diagnosa (440, 160) -->
        <path d="M 350 160 L 440 160" marker-end="url(#arrow)" />

        <!-- 2. tb_user to tb_tiket_perbaikan (via id_operator) -->
        <!-- tb_user top (200, 50) -> (200, 25) -> (1130, 25) -> tb_tiket_perbaikan (1130, 50) -->
        <path d="M 200 50 L 200 25 L 1130 25 L 1130 50" marker-end="url(#arrow)" />

        <!-- 3. tb_mesin to tb_gejala (via mesin_id) -->
        <!-- tb_mesin right (350, 480) -> (400, 480) -> (400, 440) -> tb_gejala (440, 440) -->
        <path d="M 350 480 L 400 480 L 400 440 L 440 440" marker-end="url(#arrow)" />

        <!-- 4. tb_mesin to tb_diagnosa (via id_mesin) -->
        <!-- tb_mesin top-right (350, 420) -> (400, 420) -> (400, 200) -> tb_diagnosa (440, 200) -->
        <path d="M 350 420 L 400 420 L 400 200 L 440 200" marker-end="url(#arrow)" />

        <!-- 5. tb_mesin to tb_tiket_perbaikan (via id_mesin) -->
        <!-- tb_mesin bottom (200, 610) -> (200, 640) -> (900, 640) -> (900, 200) -> tb_tiket_perbaikan (960, 200) -->
        <path d="M 200 610 L 200 640 L 920 640 L 920 200 L 960 200" marker-end="url(#arrow)" />

        <!-- 6. tb_gejala to tb_rule (via kode_gejala) -->
        <!-- tb_gejala bottom (600, 570) -> tb_rule (600, 680) -->
        <path d="M 600 570 L 600 680" marker-end="url(#arrow)" />

        <!-- 7. tb_kerusakan to tb_rule (via kode_kerusakan) -->
        <!-- tb_kerusakan bottom (600, 890) -> (850, 890) -> (850, 750) -> tb_rule (800, 750) -->
        <path d="M 850 680 L 850 720 L 800 720" marker-end="url(#arrow)" />

        <!-- 8. tb_kerusakan to tb_diagnosa (via id_kerusakan) -->
        <!-- tb_kerusakan left (440, 720) -> (400, 720) -> (400, 240) -> tb_diagnosa (440, 240) -->
        <!-- Wait, let's route tb_kerusakan from top (600, 680) or side to tb_diagnosa -->
        <path d="M 720 680 L 720 370 L 800 370" marker-end="url(#arrow)" />

        <!-- 9. tb_diagnosa to tb_tiket_perbaikan (via id_diagnosa) -->
        <!-- tb_diagnosa right (800, 160) -> tb_tiket_perbaikan (960, 160) -->
        <path d="M 800 160 L 960 160" marker-end="url(#arrow)" />

      </g>

      <!-- ======================================================== -->
      <!-- 1. TABEL: tb_user                                       -->
      <!-- Position: x=50, y=50, w=300, h=275                     -->
      <!-- ======================================================== -->
      <g id="table_user">
        <!-- Outer Box -->
        <rect x="50" y="50" width="300" height="275" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
        <!-- Title Banner -->
        <text x="200" y="70" class="tbl-title">tb_user</text>
        <line x1="50" y1="78" x2="350" y2="78" stroke="#000000" stroke-width="1.2" />
        <!-- Vertical PK divider -->
        <line x1="85" y1="78" x2="85" y2="325" stroke="#000000" stroke-width="1.2" />

        <!-- PK Row: id -->
        <rect x="50" y="78" width="35" height="20" fill="#ffffff" />
        <text x="67" y="92" class="pk-label">PK</text>
        <text x="92" y="92" class="attr-text"><tspan class="pk-underlined">id</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="50" y1="98" x2="350" y2="98" stroke="#000000" stroke-width="0.8" />

        <!-- Attributes -->
        <text x="92" y="114" class="attr-text">username VARCHAR(60) NOT NULL UNIQUE</text>
        <line x1="50" y1="120" x2="350" y2="120" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="136" class="attr-text">password VARCHAR(100) NOT NULL</text>
        <line x1="50" y1="142" x2="350" y2="142" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="158" class="attr-text">role ENUM('Operator','Teknisi','Admin') NOT NULL</text>
        <line x1="50" y1="164" x2="350" y2="164" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="180" class="attr-text">nama VARCHAR(120) NOT NULL</text>
        <line x1="50" y1="186" x2="350" y2="186" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="202" class="attr-text">jabatan VARCHAR(150) NOT NULL</text>
        <line x1="50" y1="208" x2="350" y2="208" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="224" class="attr-text">avatar VARCHAR(10) NOT NULL DEFAULT 'OP'</text>
        <line x1="50" y1="230" x2="350" y2="230" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="246" class="attr-text">nip VARCHAR(40) NOT NULL</text>
        <line x1="50" y1="252" x2="350" y2="252" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="268" class="attr-text">shift VARCHAR(50) NOT NULL</text>
        <line x1="50" y1="274" x2="350" y2="274" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="290" class="attr-text">created_at TIMESTAMP DEFAULT CURRENT_TIME</text>
      </g>

      <!-- ======================================================== -->
      <!-- 2. TABEL: tb_mesin                                      -->
      <!-- Position: x=50, y=380, w=300, h=230                    -->
      <!-- ======================================================== -->
      <g id="table_mesin">
        <rect x="50" y="380" width="300" height="230" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
        <text x="200" y="400" class="tbl-title">tb_mesin</text>
        <line x1="50" y1="408" x2="350" y2="408" stroke="#000000" stroke-width="1.2" />
        <line x1="85" y1="408" x2="85" y2="610" stroke="#000000" stroke-width="1.2" />

        <!-- PK Row: id -->
        <text x="67" y="422" class="pk-label">PK</text>
        <text x="92" y="422" class="attr-text"><tspan class="pk-underlined">id</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="50" y1="428" x2="350" y2="428" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="444" class="attr-text">kode VARCHAR(30) NOT NULL UNIQUE</text>
        <line x1="50" y1="450" x2="350" y2="450" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="466" class="attr-text">nama VARCHAR(120) NOT NULL</text>
        <line x1="50" y1="472" x2="350" y2="472" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="488" class="attr-text">fungsi TEXT NOT NULL</text>
        <line x1="50" y1="494" x2="350" y2="494" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="510" class="attr-text">lokasi VARCHAR(150) NOT NULL</text>
        <line x1="50" y1="516" x2="350" y2="516" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="532" class="attr-text">icon VARCHAR(40) DEFAULT 'Wrench'</text>
        <line x1="50" y1="538" x2="350" y2="538" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="554" class="attr-text">status VARCHAR(30) NOT NULL DEFAULT 'Aktif'</text>
        <line x1="50" y1="560" x2="350" y2="560" stroke="#000000" stroke-width="0.8" />

        <text x="92" y="576" class="attr-text">deskripsi TEXT</text>
      </g>

      <!-- ======================================================== -->
      <!-- 3. TABEL: tb_gejala                                     -->
      <!-- Position: x=440, y=410, w=360, h=160                    -->
      <!-- ======================================================== -->
      <g id="table_gejala">
        <rect x="440" y="410" width="360" height="160" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
        <text x="620" y="430" class="tbl-title">tb_gejala</text>
        <line x1="440" y1="438" x2="800" y2="438" stroke="#000000" stroke-width="1.2" />
        <line x1="475" y1="438" x2="475" y2="540" stroke="#000000" stroke-width="1.2" />

        <!-- PK Row: kode -->
        <text x="457" y="452" class="pk-label">PK</text>
        <text x="482" y="452" class="attr-text"><tspan class="pk-underlined">kode</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="440" y1="458" x2="800" y2="458" stroke="#000000" stroke-width="0.8" />

        <!-- FK: mesin_id -->
        <text x="457" y="472" class="pk-label">PK</text>
        <text x="482" y="472" class="attr-text"><tspan class="pk-underlined">mesin_id</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="440" y1="478" x2="800" y2="478" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="494" class="attr-text">id VARCHAR(20) NOT NULL</text>
        <line x1="440" y1="500" x2="800" y2="500" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="514" class="attr-text">nama TEXT NOT NULL</text>
        <line x1="440" y1="520" x2="800" y2="520" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="534" class="attr-text">kategori VARCHAR(50) NOT NULL</text>
        <line x1="440" y1="540" x2="800" y2="540" stroke="#000000" stroke-width="1.2" />

        <!-- FK Statement -->
        <text x="448" y="555" class="fk-text">FOREIGN KEY (mesin_id) REFERENCES tb_mesin(id)</text>
      </g>

      <!-- ======================================================== -->
      <!-- 4. TABEL: tb_diagnosa                                   -->
      <!-- Position: x=440, y=50, w=360, h=330                     -->
      <!-- ======================================================== -->
      <g id="table_diagnosa">
        <rect x="440" y="50" width="360" height="330" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
        <text x="620" y="70" class="tbl-title">tb_diagnosa</text>
        <line x1="440" y1="78" x2="800" y2="78" stroke="#000000" stroke-width="1.2" />
        <line x1="475" y1="78" x2="475" y2="280" stroke="#000000" stroke-width="1.2" />

        <!-- PK Row: id -->
        <text x="457" y="92" class="pk-label">PK</text>
        <text x="482" y="92" class="attr-text"><tspan class="pk-underlined">id</tspan> VARCHAR(30) NOT NULL</text>
        <line x1="440" y1="98" x2="800" y2="98" stroke="#000000" stroke-width="0.8" />

        <!-- FK: id_user -->
        <text x="457" y="114" class="pk-label">PK</text>
        <text x="482" y="114" class="attr-text"><tspan class="pk-underlined">id_user</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="440" y1="120" x2="800" y2="120" stroke="#000000" stroke-width="0.8" />

        <!-- FK: id_mesin -->
        <text x="457" y="136" class="pk-label">PK</text>
        <text x="482" y="136" class="attr-text"><tspan class="pk-underlined">id_mesin</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="440" y1="142" x2="800" y2="142" stroke="#000000" stroke-width="0.8" />

        <!-- FK: id_kerusakan -->
        <text x="457" y="158" class="pk-label">PK</text>
        <text x="482" y="158" class="attr-text"><tspan class="pk-underlined">id_kerusakan</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="440" y1="164" x2="800" y2="164" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="180" class="attr-text">gejala_terpilih TEXT NOT NULL</text>
        <line x1="440" y1="186" x2="800" y2="186" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="202" class="attr-text">tingkat VARCHAR(30) NOT NULL</text>
        <line x1="440" y1="208" x2="800" y2="208" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="224" class="attr-text">persentase INT NOT NULL DEFAULT 100</text>
        <line x1="440" y1="230" x2="800" y2="230" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="246" class="attr-text">solusi TEXT</text>
        <line x1="440" y1="252" x2="800" y2="252" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="268" class="attr-text">status_panggilan VARCHAR(40) NOT NULL</text>
        <line x1="440" y1="274" x2="800" y2="274" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="286" class="attr-text">created_at TIMESTAMP DEFAULT CURRENT_TIME</text>
        <line x1="440" y1="292" x2="800" y2="292" stroke="#000000" stroke-width="1.2" />

        <!-- FK Statements -->
        <text x="448" y="307" class="fk-text">FOREIGN KEY (id_user) REFERENCES tb_user(id)</text>
        <text x="448" y="321" class="fk-text">FOREIGN KEY (id_mesin) REFERENCES tb_mesin(id)</text>
        <text x="448" y="335" class="fk-text">FOREIGN KEY (id_kerusakan) REFERENCES tb_kerusakan(kode)</text>
      </g>

      <!-- ======================================================== -->
      <!-- 5. TABEL: tb_tiket_perbaikan                            -->
      <!-- Position: x=960, y=50, w=380, h=410                     -->
      <!-- ======================================================== -->
      <g id="table_tiket">
        <rect x="960" y="50" width="380" height="410" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
        <text x="1150" y="70" class="tbl-title">tb_tiket_perbaikan</text>
        <line x1="960" y1="78" x2="1340" y2="78" stroke="#000000" stroke-width="1.2" />
        <line x1="995" y1="78" x2="995" y2="360" stroke="#000000" stroke-width="1.2" />

        <!-- PK Row: id -->
        <text x="977" y="92" class="pk-label">PK</text>
        <text x="1002" y="92" class="attr-text"><tspan class="pk-underlined">id</tspan> VARCHAR(30) NOT NULL</text>
        <line x1="960" y1="98" x2="1340" y2="98" stroke="#000000" stroke-width="0.8" />

        <!-- FK: id_operator -->
        <text x="977" y="114" class="pk-label">PK</text>
        <text x="1002" y="114" class="attr-text"><tspan class="pk-underlined">id_operator</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="960" y1="120" x2="1340" y2="120" stroke="#000000" stroke-width="0.8" />

        <!-- FK: id_mesin -->
        <text x="977" y="136" class="pk-label">PK</text>
        <text x="1002" y="136" class="attr-text"><tspan class="pk-underlined">id_mesin</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="960" y1="142" x2="1340" y2="142" stroke="#000000" stroke-width="0.8" />

        <!-- FK: id_diagnosa -->
        <text x="977" y="158" class="pk-label">PK</text>
        <text x="1002" y="158" class="attr-text"><tspan class="pk-underlined">id_diagnosa</tspan> VARCHAR(30)</text>
        <line x1="960" y1="164" x2="1340" y2="164" stroke="#000000" stroke-width="0.8" />

        <text x="1002" y="180" class="attr-text">lokasi VARCHAR(150) NOT NULL</text>
        <line x1="960" y1="186" x2="1340" y2="186" stroke="#000000" stroke-width="0.8" />

        <text x="1002" y="202" class="attr-text">kerusakan VARCHAR(180) NOT NULL</text>
        <line x1="960" y1="208" x2="1340" y2="208" stroke="#000000" stroke-width="0.8" />

        <text x="1002" y="224" class="attr-text">tingkat VARCHAR(30) NOT NULL DEFAULT 'Parah'</text>
        <line x1="960" y1="230" x2="1340" y2="230" stroke="#000000" stroke-width="0.8" />

        <text x="1002" y="246" class="attr-text">urgensi ENUM('Normal','Urgent','Emergency') NOT NULL</text>
        <line x1="960" y1="252" x2="1340" y2="252" stroke="#000000" stroke-width="0.8" />

        <text x="1002" y="268" class="attr-text">status ENUM('Menunggu Teknisi','Sedang Ditangani','Selesai')</text>
        <line x1="960" y1="274" x2="1340" y2="274" stroke="#000000" stroke-width="0.8" />

        <text x="1002" y="290" class="attr-text">teknisi_penanggung VARCHAR(120)</text>
        <line x1="960" y1="296" x2="1340" y2="296" stroke="#000000" stroke-width="0.8" />

        <text x="1002" y="312" class="attr-text">tindakan_teknisi TEXT</text>
        <line x1="960" y1="318" x2="1340" y2="318" stroke="#000000" stroke-width="0.8" />

        <text x="1002" y="334" class="attr-text">rekomendasi_teknisi TEXT</text>
        <line x1="960" y1="340" x2="1340" y2="340" stroke="#000000" stroke-width="0.8" />

        <text x="1002" y="354" class="attr-text">created_at TIMESTAMP DEFAULT CURRENT_TIME</text>
        <line x1="960" y1="360" x2="1340" y2="360" stroke="#000000" stroke-width="1.2" />

        <!-- FK Statements -->
        <text x="968" y="375" class="fk-text">FOREIGN KEY (id_operator) REFERENCES tb_user(id)</text>
        <text x="968" y="390" class="fk-text">FOREIGN KEY (id_mesin) REFERENCES tb_mesin(id)</text>
        <text x="968" y="405" class="fk-text">FOREIGN KEY (id_diagnosa) REFERENCES tb_diagnosa(id)</text>
      </g>

      <!-- ======================================================== -->
      <!-- 6. TABEL: tb_kerusakan                                  -->
      <!-- Position: x=880, y=500, w=360, h=210                    -->
      <!-- ======================================================== -->
      <g id="table_kerusakan">
        <rect x="880" y="500" width="360" height="210" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
        <text x="1060" y="520" class="tbl-title">tb_kerusakan</text>
        <line x1="880" y1="528" x2="1240" y2="528" stroke="#000000" stroke-width="1.2" />
        <line x1="915" y1="528" x2="915" y2="710" stroke="#000000" stroke-width="1.2" />

        <!-- PK Row: kode -->
        <text x="897" y="542" class="pk-label">PK</text>
        <text x="922" y="542" class="attr-text"><tspan class="pk-underlined">kode</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="880" y1="548" x2="1240" y2="548" stroke="#000000" stroke-width="0.8" />

        <text x="922" y="564" class="attr-text">id VARCHAR(20) NOT NULL</text>
        <line x1="880" y1="570" x2="1240" y2="570" stroke="#000000" stroke-width="0.8" />

        <text x="922" y="586" class="attr-text">nama VARCHAR(180) NOT NULL</text>
        <line x1="880" y1="592" x2="1240" y2="592" stroke="#000000" stroke-width="0.8" />

        <text x="922" y="608" class="attr-text">tingkat ENUM('Ringan','Sedang','Parah') NOT NULL</text>
        <line x1="880" y1="614" x2="1240" y2="614" stroke="#000000" stroke-width="0.8" />

        <text x="922" y="630" class="attr-text">kategori VARCHAR(60) NOT NULL</text>
        <line x1="880" y1="636" x2="1240" y2="636" stroke="#000000" stroke-width="0.8" />

        <text x="922" y="652" class="attr-text">penanganan_oleh VARCHAR(40) NOT NULL</text>
        <line x1="880" y1="658" x2="1240" y2="658" stroke="#000000" stroke-width="0.8" />

        <text x="922" y="674" class="attr-text">solusi TEXT NOT NULL</text>
        <line x1="880" y1="680" x2="1240" y2="680" stroke="#000000" stroke-width="0.8" />

        <text x="922" y="694" class="attr-text">tindakan_operator TEXT</text>
      </g>

      <!-- ======================================================== -->
      <!-- 7. TABEL: tb_rule                                       -->
      <!-- Position: x=440, y=680, w=360, h=190                    -->
      <!-- ======================================================== -->
      <g id="table_rule">
        <rect x="440" y="680" width="360" height="190" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
        <text x="620" y="700" class="tbl-title">tb_rule</text>
        <line x1="440" y1="708" x2="800" y2="708" stroke="#000000" stroke-width="1.2" />
        <line x1="475" y1="708" x2="475" y2="830" stroke="#000000" stroke-width="1.2" />

        <!-- PK Row: id -->
        <text x="457" y="722" class="pk-label">PK</text>
        <text x="482" y="722" class="attr-text"><tspan class="pk-underlined">id</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="440" y1="728" x2="800" y2="728" stroke="#000000" stroke-width="0.8" />

        <!-- FK: kode_gejala -->
        <text x="457" y="742" class="pk-label">PK</text>
        <text x="482" y="742" class="attr-text"><tspan class="pk-underlined">kode_gejala</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="440" y1="748" x2="800" y2="748" stroke="#000000" stroke-width="0.8" />

        <!-- FK: kode_kerusakan -->
        <text x="457" y="762" class="pk-label">PK</text>
        <text x="482" y="762" class="attr-text"><tspan class="pk-underlined">kode_kerusakan</tspan> VARCHAR(20) NOT NULL</text>
        <line x1="440" y1="768" x2="800" y2="768" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="784" class="attr-text">nama_rule VARCHAR(180) NOT NULL</text>
        <line x1="440" y1="790" x2="800" y2="790" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="804" class="attr-text">bobot DECIMAL(4,2) NOT NULL DEFAULT 1.00</text>
        <line x1="440" y1="810" x2="800" y2="810" stroke="#000000" stroke-width="0.8" />

        <text x="482" y="824" class="attr-text">kondisi TEXT NOT NULL</text>
        <line x1="440" y1="830" x2="800" y2="830" stroke="#000000" stroke-width="1.2" />

        <!-- FK Statements -->
        <text x="448" y="845" class="fk-text">FOREIGN KEY (kode_gejala) REFERENCES tb_gejala(kode)</text>
        <text x="448" y="860" class="fk-text">FOREIGN KEY (kode_kerusakan) REFERENCES tb_kerusakan(kode)</text>
      </g>

    </svg>
  </div>

</body>
</html>
"""

os.makedirs(r"D:\sistem-pakar-troubleshooting-mesin\database", exist_ok=True)
html_path = r"D:\sistem-pakar-troubleshooting-mesin\database\class_diagram_database.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Saved HTML to", html_path)
