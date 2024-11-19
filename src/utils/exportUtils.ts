import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], columns: string[], fileName: string) => {
  const doc = new jsPDF();
  
  autoTable(doc, {
    head: [columns],
    body: data.map(item => columns.map(col => item[col])),
  });

  doc.save(`${fileName}.pdf`);
};