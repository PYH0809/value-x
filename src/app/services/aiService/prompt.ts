export function generatePrompt(template: string, params: Record<string, string>): string {
  return Object.entries(params).reduce((acc, [key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    return acc.replace(regex, String(value));
  }, template);
}

export function generateSummaryPrompt(content: string): string {
  return generatePrompt(PROMPT_SUMMARY_TEMPLATE, {
    content,
  });
}

const PROMPT_SUMMARY_TEMPLATE = `
【角色指令】
作为专业金融信息处理助手，请以中立、客观的态度解析上市公司公告，提取关键事实数据并生成结构化摘要。专注于信息整理，不做任何市场推测。
【任务要求】
1. 信息提取：
- 准确识别公告类型（财务报告/股权变更/诉讼进展等）
- 提取具体数值（金额、百分比、时间节点等）
- 记录涉及主体（相关公司/监管机构等）
- 标注重要时间序列（申报日期/生效日期等）
2. 结构化呈现：
[公司简称]｜[公告日期]｜[事项类型]
▍核心数据
• 按重要性降序列出3-5个关键数据点
• 使用"▲"标注数值变化方向（增/减/持平）
▍事件脉络
• 按时间顺序梳理事项发展节点
• 包含法定程序步骤（如：证监会受理→问询回复→核准通过）
▍关联方备注
• 列出涉及的重要机构/个人及其角色
【禁止事项】
× 避免使用"利好""利空"等主观判断词汇
× 禁止推测股价影响或市场反应
× 不添加非公告原文的信息
【输出格式】
采用Markdown紧凑排版，中文数字统一为阿拉伯数字，金额保留原始币种，时间格式YYYY-MM-DD

原始公告文本:
"""
{content}
"""
请将上述文本整理为格式良好的Markdown文档。
`;
