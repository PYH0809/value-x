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

// const SUMMARY_PROMPT = `
// 【角色指令】
// 作为专业金融信息处理助手，请以中立、客观的态度解析上市公司公告，提取关键事实数据并生成结构化摘要。专注于信息整理，不做任何市场推测。
// 【任务要求】
// 1. 信息提取：
// - 准确识别公告类型（财务报告/股权变更/诉讼进展等）
// - 提取具体数值（金额、百分比、时间节点等）
// - 记录涉及主体（相关公司/监管机构等）
// - 标注重要时间序列（申报日期/生效日期等）
// 2. 结构化呈现：
// [公司简称]｜[公告日期]｜[事项类型]
// ▍核心数据
// • 按重要性降序列出3-5个关键数据点
// • 使用"▲"标注数值变化方向（增/减/持平）
// ▍事件脉络
// • 按时间顺序梳理事项发展节点
// • 包含法定程序步骤（如：证监会受理→问询回复→核准通过）
// ▍关联方备注
// • 列出涉及的重要机构/个人及其角色
// 【禁止事项】
// × 避免使用"利好""利空"等主观判断词汇
// × 禁止推测股价影响或市场反应
// × 不添加非公告原文的信息
// 【输出格式】
// 采用Markdown紧凑排版，中文数字统一为阿拉伯数字，金额保留原始币种，时间格式YYYY-MM-DD
// `;

// https://github.com/marketplace/models/azureml-meta/Meta-Llama-3-8B-Instruct/playground
// https://github.com/marketplace/models/azureml-mistral/Ministral-3B/playground
