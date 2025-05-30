function generateFullReport() {
    if (!fetchedAnswers || fetchedAnswers.length === 0) {
        alert("Δεν υπάρχουν εγγραφές για αναφορά.");
        return;
    }

    let reportHTML = `<h1>Αναφορά Απαντήσεων για Όλες τις Υπηρεσίες</h1>`;

    fetchedAnswers.forEach((answers, index) => {
        // Καθαρισμός keys
        const cleanedAnswers = {};
        Object.keys(answers).forEach(key => {
            cleanedAnswers[key.trim()] = answers[key];
        });

        const date = new Date(cleanedAnswers.timestamp).toLocaleString("el-GR");
        const service = cleanedAnswers.service || "Άγνωστη Υπηρεσία";
        const organization = cleanedAnswers.organization || "Άγνωστος Οργανισμός";

        reportHTML += `<hr><h2>Υπηρεσία: ${service} - Οργανισμός: ${organization}</h2>`;
        reportHTML += `<p><em>Ημερομηνία: ${date}</em></p>`;

        // Κατηγορίες και βαθμολογίες
        const categories = {
            "Ανθρωποκεντρικότητα": cleanedAnswers.category1 || "Δεν υπάρχουν δεδομένα",
            "Κλινική Αποτελεσματικότητα": cleanedAnswers.category2 || "Δεν υπάρχουν δεδομένα",
            "Ασφάλεια και Απόρρητο": cleanedAnswers.category3 || "Δεν υπάρχουν δεδομένα",
        };

        // Επίπεδα (ίδια λογική όπως στο displayAnswers)
        function getLevel(score, ranges) {
            if (score <= ranges.lowMax) {
                return { label: "Χαμηλό", color: "#FF4C4C" };
            } else if (score <= ranges.mediumMax) {
                return { label: "Μέτριο", color: "#FF8C00" };
            } else {
                return { label: "Υψηλό", color: "#32CD32" };
            }
        }

        const score1 = parseInt(cleanedAnswers.category1);
        const score2 = parseInt(cleanedAnswers.category2);
        const score3 = parseInt(cleanedAnswers.category3);
        const totalScore = parseInt(cleanedAnswers.totalScore);

        const level1 = getLevel(score1, { lowMax: 20, mediumMax: 32 });
        const level2 = getLevel(score2, { lowMax: 9, mediumMax: 15 });
        const level3 = getLevel(score3, { lowMax: 7, mediumMax: 11 });
        const totalLevel = getLevel(totalScore, { lowMax: 36, mediumMax: 59 });

        reportHTML += `<ul>`;
        reportHTML += `<li><strong>Ανθρωποκεντρικότητα:</strong> ${score1} <span style="color:${level1.color}; font-weight:bold;">${level1.label}</span></li>`;
        reportHTML += `<li><strong>Κλινική Αποτελεσματικότητα:</strong> ${score2} <span style="color:${level2.color}; font-weight:bold;">${level2.label}</span></li>`;
        reportHTML += `<li><strong>Ασφάλεια και Απόρρητο:</strong> ${score3} <span style="color:${level3.color}; font-weight:bold;">${level3.label}</span></li>`;
        reportHTML += `</ul>`;

        reportHTML += `<p><strong>Συνολική Βαθμολογία:</strong> ${totalScore} <span style="color:${totalLevel.color}; font-weight:bold;">${totalLevel.label}</span></p>`;

        // Ερωτήσεις και απαντήσεις
        reportHTML += `<h3>Ερωτήσεις & Απαντήσεις:</h3>`;
        reportHTML += `<ol>`;
        for (let i = 1; i <= 16; i++) {
            const qKey = `q${i}`;
            const value = cleanedAnswers[qKey];
            const title = questionTitles[qKey] || qKey;
            const fullAnswer = answerTexts[qKey]?.[value] || "-";

            reportHTML += `<li><strong>Ερώτηση:</strong> ${title} <br> <strong>Απάντηση:</strong> ${fullAnswer} (Επίπεδο: ${value || "-"})</li>`;
        }
        reportHTML += `</ol>`;
    });

    // Εμφάνιση στο div με id reportContainer
    const reportContainer = document.getElementById("reportContainer");
    reportContainer.innerHTML = reportHTML;
}

function exportToWord() {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
                   "xmlns:w='urn:schemas-microsoft-com:office:word' "+
                   "xmlns='http://www.w3.org/TR/REC-html40'>"+
                   "<head><meta charset='utf-8'><title>Αναφορά</title></head><body>";
    const footer = "</body></html>";

    const content = document.getElementById("reportContainer").innerHTML;
    const sourceHTML = header + content + footer;

    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });

    // Κατέβασμα αρχείου
    saveAs(blob, 'report.doc');
}
