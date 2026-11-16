/**
 * Forward Chaining Inference Engine
 * Sistem Pakar Troubleshooting Mesin Pabrik
 * Sesuai Dokumen 1 & Dokumen 2 (PT Vivo Mobile Indonesia)
 */

export function runForwardChaining({ selectedGejalaIds, rules, kerusakanList, selectedMachineId = null }) {
  if (!selectedGejalaIds || selectedGejalaIds.length === 0) {
    return {
      success: false,
      message: 'Belum ada gejala yang dipilih untuk proses inferensi.',
      results: [],
      reasoningSteps: []
    };
  }

  const steps = [];
  steps.push({
    step: 1,
    title: 'Fakta Awal (Fact Assertion)',
    description: `Menerima ${selectedGejalaIds.length} fakta gejala dari input operator: [${selectedGejalaIds.join(', ')}]`
  });

  // Group rules by damage (kodeKerusakan)
  const damageRuleMap = {};
  kerusakanList.forEach(k => {
    damageRuleMap[k.kode] = {
      kerusakan: k,
      associatedRules: [],
      requiredSymptoms: new Set(),
      matchedSymptoms: new Set()
    };
  });

  rules.forEach(rule => {
    if (damageRuleMap[rule.kodeKerusakan]) {
      damageRuleMap[rule.kodeKerusakan].associatedRules.push(rule);
      damageRuleMap[rule.kodeKerusakan].requiredSymptoms.add(rule.kodeGejala);
    }
  });

  steps.push({
    step: 2,
    title: 'Pencocokan Aturan (Rule Matching)',
    description: `Mengevaluasi ${rules.length} aturan (IF-THEN) pada basis pengetahuan terhadap fakta yang masuk.`
  });

  const evaluationList = [];

  // Evaluate matching for each damage candidate
  Object.keys(damageRuleMap).forEach(kodeK => {
    const item = damageRuleMap[kodeK];
    const totalRequired = item.requiredSymptoms.size;
    if (totalRequired === 0) return;

    selectedGejalaIds.forEach(gejalaKode => {
      if (item.requiredSymptoms.has(gejalaKode)) {
        item.matchedSymptoms.add(gejalaKode);
      }
    });

    const matchCount = item.matchedSymptoms.size;
    if (matchCount > 0) {
      // Rumus sesuai Dokumen 2: (Jumlah Gejala yang Cocok / Total Gejala pada Rule) * 100%
      const percentage = Math.round((matchCount / totalRequired) * 100);

      // Klasifikasi Tingkat Kerusakan
      let tingkat = item.kerusakan.tingkat || 'Sedang';
      if (percentage >= 80) {
        tingkat = 'Parah';
      } else if (percentage >= 50) {
        tingkat = item.kerusakan.tingkat === 'Ringan' ? 'Ringan' : 'Sedang';
      } else {
        tingkat = 'Ringan';
      }

      // Butuh panggil teknisi jika tingkat Parah atau kerusakan berlabel Parah
      const butuhTeknisi = tingkat === 'Parah' || item.kerusakan.penangananOleh === 'Teknisi';

      evaluationList.push({
        kodeKerusakan: kodeK,
        namaKerusakan: item.kerusakan.nama,
        solusi: item.kerusakan.solusi,
        tindakanOperator: item.kerusakan.tindakanOperator,
        rekomendasiTeknisi: item.kerusakan.rekomendasiTeknisi,
        penangananOleh: item.kerusakan.penangananOleh,
        matchCount,
        totalRequired,
        matchedSymptoms: Array.from(item.matchedSymptoms),
        percentage,
        tingkat,
        butuhTeknisi,
        rulesTriggered: item.associatedRules.filter(r => selectedGejalaIds.includes(r.kodeGejala))
      });
    }
  });

  // Sort by highest percentage match, then matchCount
  evaluationList.sort((a, b) => {
    if (b.percentage !== a.percentage) return b.percentage - a.percentage;
    return b.matchCount - a.matchCount;
  });

  steps.push({
    step: 3,
    title: 'Resolusi Konflik & Perhitungan Keyakinan',
    description: `Ditemukan ${evaluationList.length} potensi kerusakan. Menghitung persentase kecocokan rumus: (Gejala Cocok / Total Gejala Rule) x 100%.`
  });

  if (evaluationList.length > 0) {
    const topResult = evaluationList[0];
    steps.push({
      step: 4,
      title: 'Penarikan Kesimpulan (Conclusion)',
      description: `Sistem menyimpulkan kerusakan paling dominan adalah [${topResult.kodeKerusakan}] ${topResult.namaKerusakan} dengan tingkat kecocokan ${topResult.percentage}% (Kategori: ${topResult.tingkat}).`
    });
  } else {
    steps.push({
      step: 4,
      title: 'Tidak Ada Aturan Cocok',
      description: 'Gejala yang dipilih tidak memenuhi antecedent aturan manapun dalam basis data.'
    });
  }

  return {
    success: evaluationList.length > 0,
    topDiagnosis: evaluationList[0] || null,
    allCandidates: evaluationList,
    reasoningSteps: steps
  };
}

