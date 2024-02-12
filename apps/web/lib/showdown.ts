export const markdownToHtml = (markdown: string) => {
  const showdown = require("showdown");
  const converter = new showdown.Converter();
  try {
    const html = converter.makeHtml(markdown);
    return html;
  } catch (e) {
    return markdown;
  }
};
