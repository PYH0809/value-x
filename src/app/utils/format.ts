export const formatNumber = (num: number) => {
  if (!num || isNaN(num)) return '无';
  if (num >= 1e8) return (num / 1e8).toFixed(2) + ' 亿';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + ' 百万';
  if (num >= 1e4) return (num / 1e4).toFixed(2) + ' 万';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + ' 千';
  return num.toFixed(2);
};

export const formatDate = (date: number) => {
  const currentDate = new Date();
  const inputDate = new Date(date);

  const timeDifference = currentDate.getTime() - inputDate.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const oneHour = 1000 * 60 * 60;
  const oneMinute = 1000 * 60;

  if (timeDifference < oneMinute) {
    return '刚刚';
  }

  if (timeDifference < oneHour) {
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    return `${minutesAgo} 分钟前`;
  }

  if (timeDifference < oneDay) {
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
    return `${hoursAgo} 小时前`;
  }

  const year = inputDate.getFullYear();
  const month = inputDate.getMonth() + 1;
  const day = inputDate.getDate();

  return `${year}-${month}-${day}`;
};
