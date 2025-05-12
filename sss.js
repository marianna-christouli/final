function exportToCSV() {
    if (!fetchedAnswers.length) return alert("Δεν υπάρχουν απαντήσεις προς εξαγωγή.");

    const headers = Object.keys(fetchedAnswers[0]);
    const csvRows = [headers.join(",")];

    fetchedAnswers.forEach(obj => {
        const row = headers.map(key => `"${(obj[key] || "").toString().replace(/"/g, '""')}"`);
        csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "apantiseis.csv";
    link.click();
}

function exportToTXT() {
    if (!fetchedAnswers.length) return alert("Δεν υπάρχουν απαντήσεις προς εξαγωγή.");

    let txtContent = "";

    fetchedAnswers.forEach((entry, index) => {
        txtContent += `Ερώτηση ${index + 1}: ${entry.question || "-"}\nΑπάντηση: ${entry.answer || "-"}\n\n`;
    });

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "apantiseis.txt";
    link.click();
}

function exportToPDF() {
    if (!fetchedAnswers.length) return alert("Δεν υπάρχουν απαντήσεις προς εξαγωγή.");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Απαντήσεις Χρήστη", 14, 15);

    let y = 25;
    fetchedAnswers.forEach((entry, index) => {
        doc.setFontSize(12);
        doc.text(`Ερώτηση ${index + 1}: ${entry.question || "-"}`, 14, y);
        y += 7;
        doc.text(`Απάντηση: ${entry.answer || "-"}`, 14, y);
        y += 10;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save("apantiseis.pdf");
}
