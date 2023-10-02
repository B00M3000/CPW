import Papa from 'papaparse';

interface CSVObject {
  [column: string]: string;
}

export async function parseCSV(file: File): Promise<CSVObject[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: function (results: any) {
        resolve(results.data);
      },
      header: true, 
      error: function (error: any) {
        reject(error.message);
      },
    });
  });
}