import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Incident } from '../../firebase/services';

export const generateWeeklyIncidentReport = (incidents: Incident[]) => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Header
    doc.setFillColor(0, 51, 153); // Blue-900 equivalent
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('NAGAR SARTHI', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('WEEKLY INCIDENT REOPRT', 105, 30, { align: 'center' });

    // Basic Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated on: ${timestamp}`, 14, 50);
    doc.text('Authority: Jamshedpur Municipal Authority', 14, 56);
    doc.text('Subject: Weekly Smart City Incident Summary', 14, 62);

    // Horizontal Line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 68, 196, 68);

    // Summary Section
    doc.setFontSize(14);
    doc.text('Executive Summary', 14, 78);
    doc.setFontSize(10);

    const stats = [
        ['Total Incidents Reported', incidents.length.toString()],
        ['Verified Incidents', incidents.filter(i => i.verified).length.toString()],
        ['Resolved Incidents', incidents.filter(i => i.status === 'resolved').length.toString()],
        ['Pending Action', incidents.filter(i => i.status === 'pending').length.toString()],
    ];

    autoTable(doc, {
        startY: 82,
        head: [['Metric', 'Value']],
        body: stats,
        theme: 'striped',
        headStyles: { fillColor: [51, 122, 183] },
        margin: { left: 14, right: 14 }
    });

    // Detailed Table
    const lastY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Detailed Incident Log', 14, lastY);

    const tableData = incidents.map(incident => [
        incident.id?.slice(0, 8) || 'N/A',
        incident.title,
        incident.category,
        incident.locationName || 'Unknown',
        incident.status,
        incident.severity || 'Medium'
    ]);

    autoTable(doc, {
        startY: lastY + 5,
        head: [['ID', 'Title', 'Category', 'Location', 'Status', 'Severity']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 153] },
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        const footerText = `© 2026 Nagar Sarthi | Smart Cities Mission | Page ${i} of ${pageCount}`;
        doc.text(footerText, 105, 287, { align: 'center' });
    }

    // Download
    doc.save(`weekly-incident-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
