export type Stock = {
  name: string;
  code: string;
  category: 'AStock';
  orgId: string;
  shortName: string;
};

export type StockMarket = 'SZ' | 'SH';

export type StockQuestionResponse = {
  indexId: string;
  mainContent: string; // 问题内容
  attachedContent: string; // 回答内容
  authorName: string;
  pubDate: number;
  updateDate: number;
  stockCode: string;
  contentType: number;
};

export type StockTradeResponse = {
  data: {
    symbol: string;
    timestamp: number;
    current: number;
    chg: number;
    percent: number;
    trade_volume: number;
    side: number;
    level: number;
    trade_session: null;
    trade_type: null;
    trade_unique_id: string;
    bid_appl_seq_num: null;
    offer_appl_seq_num: null;
    trade_type_v2: null;
  }[];
  error_code: string;
  error_description: string;
};

/**
 * @desc data: ["2021-09-01", "12.34"][]
 */
export type StockWeekTradeResponse = {
  code: string;
  msg: string;
  data: [string, string][];
};
