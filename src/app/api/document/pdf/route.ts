import { NextResponse, NextRequest } from 'next/server';
import http from 'http';
import https from 'https';
import pdfParse from 'pdf-parse';

/**
 * @param {string} url -
 * @desc fetch stock question by eastmoney
 */
export async function GET(req: NextRequest) {
  const fileURL = new URL(req.url).searchParams.get('url');
  if (!fileURL) {
    return NextResponse.json({ message: 'Please provide fileURL' }, { status: 400 });
  }

  try {
    new URL(fileURL);
  } catch {
    return NextResponse.json({ message: 'Invalid URL' }, { status: 400 });
  }

  const isHttps = new URL(fileURL).protocol === 'https:';
  const client = isHttps ? https : http;
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    client.get(fileURL, (res) => {
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

  const data = await pdfParse(pdfBuffer).catch((err) => {
    console.error('Error parsing PDF:', err);
  });
  if (!data) {
    return NextResponse.json({ message: 'Error parsing PDF' }, { status: 500 });
  }
  return NextResponse.json(data.text);
}

// const PROMPT = `
// 你是一个专业的文档格式化专家。请对以下从PDF提取的原始文本进行智能格式化处理，并转换为清晰的Markdown格式。

// ## 处理规则：
// 1. 识别并合并段落中的不必要换行，保留段落之间的自然分隔
// 2. 识别并格式化标题，使用适当的Markdown标题格式(#, ##, ###等)
// 3. 保留列表结构，转换为Markdown列表格式
// 4. 识别表格结构并转换为Markdown表格
// 5. 移除页眉页脚、页码等无关内容
// 6. 识别并正确转换引用内容
// 7. 保留重要的格式特征(加粗、斜体等)

// ## 输出要求：
// - 使用清晰的Markdown语法
// - 内容结构层次分明
// - 段落间保留适当空行
// - 不要保留原文中多余的空格和无意义的换行
// - 不要添加原文中不存在的内容

// 原始PDF文本:
// """
// {PDF_EXTRACTED_TEXT}
// """

// 请将上述文本整理为格式良好的Markdown文档。
// `;

// https://github.com/marketplace/models/azureml-meta/Meta-Llama-3-8B-Instruct/playground
// https://github.com/marketplace/models/azureml-mistral/Ministral-3B/playground
