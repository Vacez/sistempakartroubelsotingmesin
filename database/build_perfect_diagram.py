import os
import subprocess
import shutil

def create_table_svg(tbl_name, x, y, w, rows, fk_statements):
    row_height = 21
    header_height = 28
    fk_row_height = 18
    
    num_rows = len(rows)
    num_fks = len(fk_statements)
    
    attr_height = num_rows * row_height
    fk_height = (num_fks * fk_row_height + 10) if num_fks > 0 else 0
    total_height = header_height + attr_height + fk_height
    
    svg = []
    # Table Outer Box
    svg.append(f'  <!-- TABLE: {tbl_name} -->')
    svg.append(f'  <g id="tbl_{tbl_name}">')
    svg.append(f'    <rect x="{x}" y="{y}" width="{w}" height="{total_height}" fill="#ffffff" stroke="#000000" stroke-width="1.5" />')
    
    # Title Header
    title_y = y + 19
    svg.append(f'    <text x="{x + w/2}" y="{title_y}" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">{tbl_name}</text>')
    divider_y = y + header_height
    svg.append(f'    <line x1="{x}" y1="{divider_y}" x2="{x + w}" y2="{divider_y}" stroke="#000000" stroke-width="1.2" />')
    
    # Vertical line between PK and attributes
    pk_col_width = 34
    vert_end_y = divider_y + attr_height
    svg.append(f'    <line x1="{x + pk_col_width}" y1="{divider_y}" x2="{x + pk_col_width}" y2="{vert_end_y}" stroke="#000000" stroke-width="1.0" />')
    
    # Rows
    curr_y = divider_y
    for i, row in enumerate(rows):
        is_pk = row.get("is_pk", False)
        name = row.get("name", "")
        dtype = row.get("type", "")
        constraints = row.get("constraints", "")
        
        # Horizontal row divider line
        if i > 0:
            svg.append(f'    <line x1="{x}" y1="{curr_y}" x2="{x + w}" y2="{curr_y}" stroke="#000000" stroke-width="0.75" />')
        
        text_baseline = curr_y + 15
        if is_pk:
            svg.append(f'    <text x="{x + pk_col_width/2}" y="{text_baseline}" font-family="Arial, Helvetica, sans-serif" font-size="10.5" font-weight="bold" text-anchor="middle">PK</text>')
            rest_text = f' {dtype} {constraints}'.rstrip()
            svg.append(f'    <text x="{x + pk_col_width + 7}" y="{text_baseline}" font-family="Arial, Helvetica, sans-serif" font-size="10.5"><tspan text-decoration="underline" font-weight="bold">{name}</tspan><tspan>{rest_text}</tspan></text>')
        else:
            full_text = f'{name} {dtype} {constraints}'.rstrip()
            svg.append(f'    <text x="{x + pk_col_width + 7}" y="{text_baseline}" font-family="Arial, Helvetica, sans-serif" font-size="10.5">{full_text}</text>')
            
        curr_y += row_height
        
    # FK Section
    if num_fks > 0:
        svg.append(f'    <line x1="{x}" y1="{vert_end_y}" x2="{x + w}" y2="{vert_end_y}" stroke="#000000" stroke-width="1.2" />')
        fk_start_y = vert_end_y + 15
        for j, fk in enumerate(fk_statements):
            fy = fk_start_y + (j * fk_row_height)
            svg.append(f'    <text x="{x + 8}" y="{fy}" font-family="Arial, Helvetica, sans-serif" font-size="10.5">{fk}</text>')
            
    svg.append('  </g>')
    return "\n".join(svg), total_height

# Database Table Definitions (Matches db_sistem_pakar_mesin.sql 3NF)
tables = {
    "tb_user": {
        "x": 40, "y": 60, "w": 330,
        "rows": [
            {"is_pk": True, "name": "id", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "username", "type": "VARCHAR(60)", "constraints": "NOT NULL UNIQUE"},
            {"is_pk": False, "name": "password", "type": "VARCHAR(100)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "role", "type": "ENUM('Operator','Teknisi','Admin')", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "nama", "type": "VARCHAR(120)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "jabatan", "type": "VARCHAR(150)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "avatar", "type": "VARCHAR(10)", "constraints": "NOT NULL DEFAULT 'OP'"},
            {"is_pk": False, "name": "nip", "type": "VARCHAR(40)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "shift", "type": "VARCHAR(50)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "created_at", "type": "TIMESTAMP", "constraints": "DEFAULT CURRENT_TIME"}
        ],
        "fks": []
    },
    "tb_mesin": {
        "x": 40, "y": 405, "w": 330,
        "rows": [
            {"is_pk": True, "name": "id", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "kode", "type": "VARCHAR(30)", "constraints": "NOT NULL UNIQUE"},
            {"is_pk": False, "name": "nama", "type": "VARCHAR(120)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "fungsi", "type": "TEXT", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "lokasi", "type": "VARCHAR(150)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "icon", "type": "VARCHAR(40)", "constraints": "DEFAULT 'Wrench'"},
            {"is_pk": False, "name": "status", "type": "VARCHAR(30)", "constraints": "NOT NULL DEFAULT 'Aktif'"},
            {"is_pk": False, "name": "deskripsi", "type": "TEXT", "constraints": ""}
        ],
        "fks": []
    },
    "tb_diagnosa": {
        "x": 430, "y": 60, "w": 380,
        "rows": [
            {"is_pk": True, "name": "id", "type": "VARCHAR(30)", "constraints": "NOT NULL"},
            {"is_pk": True, "name": "id_user", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": True, "name": "id_mesin", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": True, "name": "id_kerusakan", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "gejala_terpilih", "type": "TEXT", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "tingkat", "type": "VARCHAR(30)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "persentase", "type": "INT", "constraints": "NOT NULL DEFAULT 100"},
            {"is_pk": False, "name": "solusi", "type": "TEXT", "constraints": ""},
            {"is_pk": False, "name": "status_panggilan", "type": "VARCHAR(40)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "created_at", "type": "TIMESTAMP", "constraints": "DEFAULT CURRENT_TIME"}
        ],
        "fks": [
            "FOREIGN KEY (id_user) REFERENCES tb_user(id)",
            "FOREIGN KEY (id_mesin) REFERENCES tb_mesin(id)",
            "FOREIGN KEY (id_kerusakan) REFERENCES tb_kerusakan(kode)"
        ]
    },
    "tb_gejala": {
        "x": 430, "y": 420, "w": 380,
        "rows": [
            {"is_pk": True, "name": "kode", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": True, "name": "mesin_id", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "id", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "nama", "type": "TEXT", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "kategori", "type": "VARCHAR(50)", "constraints": "NOT NULL"}
        ],
        "fks": [
            "FOREIGN KEY (mesin_id) REFERENCES tb_mesin(id)"
        ]
    },
    "tb_rule": {
        "x": 430, "y": 630, "w": 380,
        "rows": [
            {"is_pk": True, "name": "id", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": True, "name": "kode_gejala", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": True, "name": "kode_kerusakan", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "nama_rule", "type": "VARCHAR(180)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "bobot", "type": "DECIMAL(4,2)", "constraints": "NOT NULL DEFAULT 1.00"},
            {"is_pk": False, "name": "kondisi", "type": "TEXT", "constraints": "NOT NULL"}
        ],
        "fks": [
            "FOREIGN KEY (kode_gejala) REFERENCES tb_gejala(kode)",
            "FOREIGN KEY (kode_kerusakan) REFERENCES tb_kerusakan(kode)"
        ]
    },
    "tb_tiket_perbaikan": {
        "x": 870, "y": 60, "w": 430,
        "rows": [
            {"is_pk": True, "name": "id", "type": "VARCHAR(30)", "constraints": "NOT NULL"},
            {"is_pk": True, "name": "id_operator", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": True, "name": "id_mesin", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": True, "name": "id_diagnosa", "type": "VARCHAR(30)", "constraints": "DEFAULT NULL"},
            {"is_pk": False, "name": "lokasi", "type": "VARCHAR(150)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "kerusakan", "type": "VARCHAR(180)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "tingkat", "type": "VARCHAR(30)", "constraints": "NOT NULL DEFAULT 'Parah'"},
            {"is_pk": False, "name": "urgensi", "type": "ENUM('Normal','Urgent','Emergency')", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "status", "type": "ENUM('Menunggu Teknisi','Sedang Ditangani','Selesai')", "constraints": ""},
            {"is_pk": False, "name": "teknisi_penanggung", "type": "VARCHAR(120)", "constraints": "DEFAULT NULL"},
            {"is_pk": False, "name": "tindakan_teknisi", "type": "TEXT", "constraints": ""},
            {"is_pk": False, "name": "rekomendasi_teknisi", "type": "TEXT", "constraints": ""},
            {"is_pk": False, "name": "created_at", "type": "TIMESTAMP", "constraints": "DEFAULT CURRENT_TIME"}
        ],
        "fks": [
            "FOREIGN KEY (id_operator) REFERENCES tb_user(id)",
            "FOREIGN KEY (id_mesin) REFERENCES tb_mesin(id)",
            "FOREIGN KEY (id_diagnosa) REFERENCES tb_diagnosa(id)"
        ]
    },
    "tb_kerusakan": {
        "x": 870, "y": 550, "w": 430,
        "rows": [
            {"is_pk": True, "name": "kode", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "id", "type": "VARCHAR(20)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "nama", "type": "VARCHAR(180)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "tingkat", "type": "ENUM('Ringan','Sedang','Parah')", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "kategori", "type": "VARCHAR(60)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "penanganan_oleh", "type": "VARCHAR(40)", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "solusi", "type": "TEXT", "constraints": "NOT NULL"},
            {"is_pk": False, "name": "tindakan_operator", "type": "TEXT", "constraints": ""},
            {"is_pk": False, "name": "rekomendasi_teknisi", "type": "TEXT", "constraints": ""}
        ],
        "fks": []
    }
}

svg_elements = []

for name, data in tables.items():
    code, h = create_table_svg(name, data["x"], data["y"], data["w"], data["rows"], data["fks"])
    svg_elements.append(code)

tables_code = "\n\n".join(svg_elements)

full_svg = f"""<svg width="1340" height="910" viewBox="0 0 1340 910" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Arrowhead Marker (Standard solid black triangle like StarUML/Draw.io) -->
    <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1340" height="910" fill="#ffffff" />

  <!-- ======================================================== -->
  <!-- RELATIONSHIP CONNECTOR LINES                             -->
  <!-- ======================================================== -->
  <g stroke="#000000" stroke-width="1.3" fill="none">
    
    <!-- 1. tb_user -> tb_diagnosa (via id_user) -->
    <path d="M 370 105 L 430 105" marker-end="url(#arrow)" />

    <!-- 2. tb_user -> tb_tiket_perbaikan (via id_operator) -->
    <path d="M 205 60 L 205 30 L 1085 30 L 1085 60" marker-end="url(#arrow)" />

    <!-- 3. tb_mesin -> tb_gejala (via mesin_id) -->
    <path d="M 370 455 L 430 455" marker-end="url(#arrow)" />

    <!-- 4. tb_mesin -> tb_diagnosa (via id_mesin) -->
    <path d="M 370 425 L 400 425 L 400 130 L 430 130" marker-end="url(#arrow)" />

    <!-- 5. tb_mesin -> tb_tiket_perbaikan (via id_mesin) -->
    <path d="M 205 605 L 205 885 L 845 885 L 845 130 L 870 130" marker-end="url(#arrow)" />

    <!-- 6. tb_gejala -> tb_rule (via kode_gejala) -->
    <path d="M 620 580 L 620 630" marker-end="url(#arrow)" />

    <!-- 7. tb_kerusakan -> tb_rule (via kode_kerusakan) -->
    <path d="M 870 650 L 830 650 L 830 700 L 810 700" marker-end="url(#arrow)" />

    <!-- 8. tb_kerusakan -> tb_diagnosa (via id_kerusakan) -->
    <path d="M 870 575 L 830 575 L 830 150 L 810 150" marker-end="url(#arrow)" />

    <!-- 9. tb_diagnosa -> tb_tiket_perbaikan (via id_diagnosa) -->
    <path d="M 810 80 L 870 80" marker-end="url(#arrow)" />

  </g>

{tables_code}

</svg>"""

standalone_html = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Class Diagram Database - Sistem Pakar Troubleshooting Mesin</title>
  <style>
    body {{
      margin: 0;
      padding: 15px;
      background: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }}
    .title-banner {{
      text-align: center;
      margin-bottom: 15px;
    }}
    .title-banner h2 {{
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 4px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    .title-banner p {{
      font-size: 12px;
      color: #555555;
      margin: 0;
    }}
    .diagram-frame {{
      border: 1px solid #000000;
      background: #ffffff;
      display: inline-block;
    }}
    @media print {{
      body {{
        padding: 0;
      }}
      .diagram-frame {{
        border: none;
      }}
    }}
  </style>
</head>
<body>
  <div class="title-banner">
    <h2>CLASS DIAGRAM DATABASE (RELATIONAL MODEL 3NF)</h2>
    <p>Sistem Pakar Troubleshooting Mesin Produksi &bull; PT Vivo Mobile Indonesia</p>
  </div>
  <div class="diagram-frame">
    {full_svg}
  </div>
</body>
</html>"""

# Paths
svg_path = r"D:\sistem-pakar-troubleshooting-mesin\database\class_diagram_database.svg"
html_path = r"D:\sistem-pakar-troubleshooting-mesin\database\class_diagram_database.html"
png_path = r"D:\sistem-pakar-troubleshooting-mesin\database\class_diagram_database.png"

artifact_dir = r"C:\Users\usr\.gemini\antigravity\brain\3e0656b5-f61e-45ac-940b-ff666409dc2d"
artifact_svg = os.path.join(artifact_dir, "class_diagram_database.svg")
artifact_html = os.path.join(artifact_dir, "class_diagram_database.html")
artifact_png = os.path.join(artifact_dir, "class_diagram_database.png")

with open(svg_path, "w", encoding="utf-8") as f:
    f.write(full_svg)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(standalone_html)

shutil.copy(svg_path, artifact_svg)
shutil.copy(html_path, artifact_html)

print("Files saved. Generating high-resolution PNG...")

# Render PNG via Headless Chrome with scale factor 1.5 for ultra sharpness
cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    f"--screenshot={png_path}",
    "--window-size=1420,1020",
    "--force-device-scale-factor=1.5",
    "--hide-scrollbars",
    html_path
]
subprocess.run(cmd, check=True)

shutil.copy(png_path, artifact_png)
print("PNG rendered and copied successfully!")
