import pdfParse from 'pdf-parse';
import http from 'http';
import https from 'https';

export async function extractPDFText(pdfBuffer: Buffer): Promise<string> {
  const data = await pdfParse(pdfBuffer).catch((err) => {
    console.error('Error parsing PDF:', err);
  });
  if (!data) {
    throw new Error('Error parsing PDF');
  }
  return data.text;
}

export async function extractPDFTextFromUrl(url: string) {
  const isHttps = new URL(url).protocol === 'https:';
  const client = isHttps ? https : http;
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    client.get(url, (res) => {
      const data: Buffer[] = [];
      res.on('data', (chunk) => {
        data.push(chunk);
      });
      res.on('end', () => {
        resolve(Buffer.concat(data));
      });
      res.on('error', (err) => {
        reject(err);
      });
    });
  });
  const text = await extractPDFText(pdfBuffer);
  return text;
}
