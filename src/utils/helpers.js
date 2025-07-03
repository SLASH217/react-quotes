export const getRandomColor = (colors) => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const buildTweetUrl = (quote, author) => {
  const text = `"${quote}" - ${author}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
};
