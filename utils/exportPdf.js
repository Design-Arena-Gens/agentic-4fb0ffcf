import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportSlidesToPdf(element, filename = 'Lecture.pdf') {
  const scale = 2; // sharper
  const canvas = await html2canvas(element, { scale, backgroundColor: getComputedStyle(document.body).backgroundColor });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [canvas.width, canvas.height] });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}
