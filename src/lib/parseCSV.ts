import * as fs from 'fs';
import * as csvParser from 'csv-parser';

interface csvObject {
  [key: string]: string;
}


export async function parseCsvFile(filePath: string): Promise<csvObject[]> {
    return new Promise<csvObject[]>((resolve, reject) => {
      const results: csvObject[] = [];
  
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: csvObject) => {
          results.push(row);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }