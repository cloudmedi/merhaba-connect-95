import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data: any[], fileName: string) => {
  // Veriyi düzleştir ve sadece gerekli alanları al
  const flattenedData = data.map(item => {
    const flatItem: any = {};
    for (const key in item) {
      if (typeof item[key] !== 'object') {
        flatItem[key] = item[key];
      } else if (Array.isArray(item[key])) {
        flatItem[key] = item[key].join(', ');
      }
    }
    return flatItem;
  });

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], columns: string[], fileName: string) => {
  const doc = new jsPDF();
  
  // Başlıkları düzenle - ilk harfi büyük yap
  const headers = columns.map(col => col.charAt(0).toUpperCase() + col.slice(1));
  
  // Veriyi düzleştir
  const body = data.map(item => 
    columns.map(col => {
      const value = item[col];
      if (typeof value === 'object' && value !== null) {
        return Array.isArray(value) ? value.join(', ') : JSON.stringify(value);
      }
      return value?.toString() || '';
    })
  );

  autoTable(doc, {
    head: [headers],
    body: body,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [155, 135, 245] },
  });

  doc.save(`${fileName}.pdf`);
};