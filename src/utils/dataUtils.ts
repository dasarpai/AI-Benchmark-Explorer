import Papa from 'papaparse';
import { Dataset } from '../types';

export const parseCSV = async (filePath: string, signal?: AbortSignal): Promise<Dataset[]> => {
  try {
    const response = await fetch(filePath, { signal });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      // Check if aborted before parsing
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Check if aborted after parsing
          if (signal?.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
            return;
          }
          
          const datasets = results.data as Dataset[];
          resolve(datasets);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
      
      // Set up abort listener
      if (signal) {
        signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        }, { once: true });
      }
    });
  } catch (error) {
    console.error('Error loading CSV file:', error);
    throw error; // Rethrow to allow proper error handling upstream
  }
};

export const getUniqueValues = (data: Dataset[], field: keyof Dataset): string[] => {
  const valueSet = new Set<string>();
  
  data.forEach(item => {
    if (item[field]) {
      // Check if the field value is a string before calling split
      const fieldValue = item[field];
      if (typeof fieldValue === 'string') {
        const values = fieldValue.split(',').map((val: string) => val.trim());
        values.forEach((val: string) => {
          if (val) valueSet.add(val);
        });
      } else if (fieldValue) {
        // If it's not a string but has a value, add it as is
        valueSet.add(String(fieldValue));
      }
    }
  });
  
  return Array.from(valueSet).sort();
};
