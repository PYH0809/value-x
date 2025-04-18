export function generatePrompt(template: string, params: Record<string, string>): string {
  return Object.entries(params).reduce((acc, [key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    return acc.replace(regex, String(value));
  }, template);
}

export function generateSummaryPrompt({ content, title }: { content: string; title: string }): string {
  return generatePrompt(PROMPT_SUMMARY_TEMPLATE, {
    content,
    title,
  });
}

const PROMPT_SUMMARY_TEMPLATE = `
【角色指令】
作为专业金融信息处理助手，请以中立、客观的态度解析上市公司公告，提取关键事实数据并生成结构化摘要。专注于信息整理，不做任何市场推测。

【任务要求】
1. 一句话概括：
- 用简洁精炼的一句话概括公告核心内容
- 包含事项类型和关键数据
- 避免重复公告标题中已出现的公司名称，直接使用"公司"或"该公司"进行指代
- 如涉及其他公司，可正常提及其名称

2. 信息提取：
- 准确识别公告类型（财务报告/股权变更/诉讼进展等）
- 提取具体数值（金额、百分比、时间节点等）
- 记录涉及主体（相关公司/监管机构等）
- 标注重要时间序列（申报日期/生效日期等）

3. 结构化呈现：

📊 核心数据
• 按重要性降序列出3-5个关键数据点
⏱️ 事件脉络
• 按时间顺序梳理事项发展节点
• 包含法定程序步骤（如：证监会受理→问询回复→核准通过）
👥 关联方备注
• 列出涉及的重要机构/个人及其角色

【禁止事项】
× 避免使用"利好""利空"等主观判断词汇
× 禁止推测股价影响或市场反应
× 不添加非公告原文的信息
× 在一句话概括中重复公告标题已包含的公司名称

【格式规范】
- 中英文混排时，英文、数字与中文之间需加空格（如"公司 2023 年营收"而非"公司2023年营收"）
- 数字千分位使用逗号分隔（如"10,000,000 元"而非"10000000 元"）
- 百分比数值保留两位小数（如"同比增长 12.34%"）
- 中文标点与英文标点不混用，全文保持一致性
- 英文名词首字母大写，专有名词保持原格式
- 货币金额采用"数字+空格+货币单位"格式（如"12,345 元"，"100 万美元"）

【输出格式】
返回有效的JSON格式，包含两个字段：
1. summary: 一句话概括（遵循上述格式规范，避免重复公告标题中的公司名称）
2. analysis: 详细分析（使用Markdown紧凑排版，遵循上述格式规范，中文数字统一为阿拉伯数字，金额保留原始币种，时间格式YYYY-MM-DD）

原始公告标题:
"""
{title}
"""

原始公告文本:
"""
{content}
"""

请直接输出JSON，不要有其他格式或解释文字，确保JSON结构有效且可解析。
`;
