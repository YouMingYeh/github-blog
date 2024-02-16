export const markdownToHtml = (markdown: string) => {
  const showdown = require("showdown");
  const converter = new showdown.Converter();
  try {
    let html = converter.makeHtml(markdown);
    if (html.startsWith("<p>")) {
      html = html.slice(3);
    }
    if (html.endsWith("</p>")) {
      html = html.slice(0, -4);
    }
    return html;
  } catch (e) {
    console.warn("Error converting markdown to HTML", e);
    return markdown;
  }
};
