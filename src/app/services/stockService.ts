import { Stock, StockMarket, StockTradeResponse } from '@/types/stock';
import { apiBaseUrl } from '@/config/site';

type StockListResponse = {
  code: string;
  pinyin: string;
  category: 'A股';
  orgId: `gssh${string} | gssz${string}`;
  zwjc: string;
};

const CATEGORY_MAP = {
  A股: 'AStock',
};

const BASE_URL = 'http://www.cninfo.com.cn';
const HTTPS_BASE_URL = 'https://irm.cninfo.com.cn';
const BASE_URL_EASTMONEY = 'https://guba.eastmoney.com/interface/GetData.aspx';
const ONE_DAY = 60 * 60 * 24;
// const ONE_WEEK = ONE_DAY * 7;

export const fetchStockList = async (): Promise<Stock[]> => {
  const response = await fetch(`${BASE_URL}/new/data/szse_stock.json`, {
    cache: 'force-cache',
    next: {
      revalidate: ONE_DAY,
    },
  });
  const data = await response.json();
  return data?.stockList.map((stock: StockListResponse) => ({
    name: stock.zwjc,
    code: stock.code,
    category: CATEGORY_MAP[stock.category],
    orgId: stock.orgId,
    shortName: stock.pinyin,
  }));
};

export const fetchStock = async (stockCode: string) => {
  const stockList = await fetchStockList();
  const stock = stockList.find((stock) => stock.code === stockCode);
  return stock ?? null;
};

export type FinancialItem =
  | 'ROE'
  | 'mainRevenue'
  | 'netProfit'
  | 'CCE' // Cash & Cash Equivalents
  | 'debtRatio'
  | 'totalShares'
  | 'circulatingShares'
  | 'goodwill'
  | 'accountsReceivable'
  | 'pledgeRate';

export type FinancialData = {
  [key in FinancialItem]: number;
};

const FINANCIAL_ITEM_RESPONE_MAP: {
  [key: string]: FinancialItem;
} = {
  F081N: 'ROE', // ROE
  F089N: 'mainRevenue', // 主营收入
  F102N: 'netProfit', // 净利润
  F109N: 'CCE', // 货币资金
  F041N: 'debtRatio', //负债率
  F020N: 'totalShares', // 总股本
  F021N: 'circulatingShares', // 流通股本
  F115N: 'goodwill', // 商誉
  F11N: 'accountsReceivable', // 应收款
  F005N: 'pledgeRate', // 质押率
};

type FinancialItemResponse = keyof typeof FINANCIAL_ITEM_RESPONE_MAP;

type FinancialDataResponse = {
  [key in FinancialItemResponse]: number;
};

export const fetchStockFinancialData = async (stockCode: string): Promise<FinancialData> => {
  const response = await fetch(`${BASE_URL}/data20/companyOverview/getHeadStripData?scode=${stockCode}`, {
    cache: 'force-cache',
    next: {
      revalidate: 60 * 60 * 24,
    },
  });
  const rsp = await response.json();
  const financialData = rsp.data.records[0] as FinancialDataResponse;
  const result = {} as FinancialData;
  Object.keys(financialData).forEach((key) => {
    const item = FINANCIAL_ITEM_RESPONE_MAP[key as FinancialItemResponse] as FinancialItem;
    if (item) {
      result[item] = financialData[key as FinancialItemResponse];
    }
  });
  return result;
};

type IntroductionItem =
  | 'mainBusiness'
  | 'industry'
  | 'companyProfile'
  | 'officialWebsite'
  | 'market'
  | 'address'
  | 'fullNmae';

type Introduction = {
  [key in IntroductionItem]: string;
};

const INTRODUCTION_ITEM_RESPONE_MAP = {
  F032V: 'industry',
  F016V: 'mainBusiness',
  F017V: 'companyProfile',
  F011V: 'officialWebsite',
  MARKET: 'market',
  F005V: 'address',
  ORGNAME: 'fullNmae',
};

type IntroductionItemResponse = keyof typeof INTRODUCTION_ITEM_RESPONE_MAP;
type IntroductionResponse = {
  [key in IntroductionItemResponse]: string;
};

export const fetchStockIntroduction = async (stockCode: string): Promise<Introduction> => {
  const response = await fetch(`${BASE_URL}/data20/companyOverview/getCompanyIntroduction?scode=${stockCode}`, {
    cache: 'force-cache',
    next: {
      revalidate: 60 * 60 * 24,
    },
  });
  const rsp = await response.json();
  const introduction = rsp.data.records[0]?.basicInformation?.[0] as IntroductionResponse;
  const result: Introduction = {} as Introduction;
  Object.keys(introduction).forEach((key) => {
    const item = INTRODUCTION_ITEM_RESPONE_MAP[key as IntroductionItemResponse] as IntroductionItem;
    if (item) {
      result[item] = introduction[key as IntroductionItemResponse];
    }
  });
  return result;
};

type FetchStockQuestionProps = {
  stockCode: string;
  pageNum?: number;
  pageSize?: number;
  keyWord?: string;
  startDay?: string;
  endDay?: string;
};

// {"post_id":1513369310,"post_user":{"user_id":"3817004951661984","user_nickname":"五粮液股友","user_name":"000858_hdymajia","user_v":0,"user_type":0,"user_is_majia":true,"user_level":0,"user_first_en_name":"wlygy","user_age":"7.9年","user_influ_level":6,"user_black_type":0,"user_third_intro":"","user_bizflag":"","user_bizsubflag":"","user_extendinfos":{"user_accreditinfos":null,"deactive":"0","user_v_hide":null,"user_column":"0","is_enterprise":"false","asset_rank":null}},"post_guba":{"stockbar_type":2,"stockbar_code":"000858","stockbar_inner_code":"000858","stockbar_name":"五粮液","stockbar_market":"000858.sz","stockbar_quote":1,"stockbar_exchange":101,"stockbar_external_code":"000858","stockbar_quote_code":"000858","stockbar_quote_market":0},"post_pdf_url":"","post_title":"董秘你好，五粮液股本38.82亿股.在行业里面是第一，影响到了股价。那为什么不回","stockbar_code":"000858","stockbar_name":"五粮液","user_id":"3817004951661984","user_nickname":"五粮液股友","post_click_count":1061,"post_forward_count":0,"post_comment_count":1,"post_like_count":0,"post_publish_time":"2024-11-09
//   11:54:48","post_last_time":"2025-02-05
//   09:49:45","post_type":11,"post_state":0,"post_from_num":12,"v_user_code":"0","post_top_status":0,"post_has_pic":false,"user_is_majia":true,"post_ip":"","extend":{"qatype":1,"strMarket":"002"},"qa":null,"post_content":"【问】董秘你好，五粮液股本38.82亿股.在行业里面是第一，影响到了股价。那为什么不回购注销股份呢？？【答】五粮液：您好，公司将根据实际情况进行研究，若有相关事项公司将按照法律法规及时披露，感谢关注！","post_abstract":"","post_relate_guba":[],"post_display_time":"2025-02-04
//   16:16:40","ask_question":"董秘你好，五粮液股本38.82亿股.在行业里面是第一，影响到了股价。那为什么不回购注销股份呢？？","ask_answer":"五粮液：您好，公司将根据实际情况进行研究，若有相关事项公司将按照法律法规及时披露，感谢关注！","post_is_collected":false,"reply_count":1,"Answer":null,"source_post_title":"","source_post_content":"","source_publish_time":"","source_post_id":0,"repost_state":0,"reptile_state":0,"allow_likes_state":0,"post_comment_authority":0,"system_comment_authority":0,"post_like_style":0,"post_tipstate":0,"disable_ad":0,"disable_color":0}
type StockQuestionResponse = {
  post_id: number;
  post_user: {
    user_nickname: string;
    user_name: string;
  };
  post_title: string;
  post_content: string;
  post_publish_time: string;
  post_last_time: string;
  post_comment_count: number;
  post_click_count: number;
  post_forward_count: number;
  post_like_count: number;
  ask_question: string;
  ask_answer: string;
};

export const fetchStockQuestionByEastmoney = async (args: FetchStockQuestionProps) => {
  const { stockCode, pageNum, pageSize } = args;

  const formData = new FormData();
  const searchParams = new URLSearchParams();
  searchParams.set('code', stockCode);
  searchParams.set('ps', (pageSize || 10).toString());
  searchParams.set('p', (pageNum || 1).toString());
  searchParams.set('qatype', (1).toString());
  const param = searchParams.toString();
  formData.append('param', param);
  formData.append('path', 'question/api/Info/Search');
  formData.append('env', '2');
  const response = await fetch(BASE_URL_EASTMONEY, {
    method: 'POST',
    body: formData,
    headers: {
      Referer: `https://guba.eastmoney.com/qa/search?code=${stockCode}`,
    },
  });

  const rsp = (await response.json()) as {
    re: StockQuestionResponse[];
  };
  const result = rsp.re.map((item) => ({
    indexId: item.post_id.toString(),
    mainContent: item.ask_question,
    attachedContent: item.ask_answer,
    authorName: item.post_user.user_name,
    pubDate: new Date(item.post_publish_time).getTime(),
    updateDate: new Date(item.post_last_time).getTime(),
    stockCode: stockCode,
    contentType: 0,
  }));
  return result;
};

type EventResponse = {
  stockcode: string;
  shortname: string;
  eventDate: number;
  eventTerm: string;
  eventReason: string;
};

export const fetchStockEvent = async (stockCode: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set('stockcode', stockCode);
  const url = new URL(`${HTTPS_BASE_URL}/newircs/company/companyMemo`);
  url.search = searchParams.toString();

  const response = await fetch(url.toString(), {
    method: 'POST',
    cache: 'force-cache',
    headers: {
      host: 'irm.cninfo.com.cn',
    },
    next: {
      revalidate: ONE_DAY,
    },
  });
  const rsp = await response.json();
  return rsp.data as EventResponse[];
};

export const fetchStockTrade = async ({ stockCode, stockMarket }: { stockCode: string; stockMarket: StockMarket }) => {
  const searchParams = new URLSearchParams();
  searchParams.set('stockCode', stockCode);
  searchParams.set('stockMarket', stockMarket);
  const url = new URL(apiBaseUrl + '/stock/trade');
  url.search = searchParams.toString();
  const response = await fetch(url.toString(), {
    method: 'GET',
  });
  const rsp = await response.json();
  return rsp as StockTradeResponse;
};
