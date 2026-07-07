export const convertDateToString = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const convertMinutesToString = (mins: number, compact: boolean = false) => (mins < 60 ? `${mins} ${compact ? 'm' : 'minute'}` : `${(mins / 60).toFixed(1)} ${compact ? 'h' : 'hour'}`) + (compact ? '' : ' read');
 
export const calculateReadingTime = (text: string, string: boolean = false) => {
  const wordsPerMinute = 225;
  const minutes = calculateWordCount(text) / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return string ? convertMinutesToString(readTime) : readTime;
};

export const calculateWordCount = (text: string) => {
  return text.split(/\s+/).length;
};
