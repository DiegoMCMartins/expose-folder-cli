class HTMLBuilder {
  titleTag = '';
  linkTags = [];

  addTitle(title) {
    this.titleTag = `<h3>${title}</h3>`;
  }
  addFileLink(fileName, filePath) {
    this.linkTags.push(`<div><a href="${filePath}">${fileName}</a></div>`);
  }
  buildHTML() {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          ${this.titleTag}
          ${this.linkTags.map(tag => tag).join('\n')}
        </body>
      </html>
    `;
  }
}

module.exports = HTMLBuilder;