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
    return markdown;
  }
};

// import { marked } from "marked";

// export const markdownToHtml = (markdown: string) => {
//   let html = marked.parse(markdown);
//   // remove the first and last <p> tags
//   if (html.startsWith("<p>")) {
//     html = html.slice(3);
//   }
//   if (html.endsWith("</p>")) {
//     html = html.slice(0, -4);
//   }

//   return html;
// };
