/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the hero image
  let heroImg = null;
  // The first .cmp-container > .aem-Grid > .image img is the hero
  const topContainer = element.querySelector('.cmp-container');
  if (topContainer) {
    const grid = topContainer.querySelector('.aem-Grid');
    if (grid) {
      const imageBlock = grid.querySelector('.image');
      if (imageBlock) {
        const img = imageBlock.querySelector('img');
        if (img) heroImg = img;
      }
    }
  }
  // Find the main content area
  let mainTitle = null, subheading = null;
  const main8 = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (main8) {
    const h1 = main8.querySelector('h1');
    if (h1) mainTitle = h1;
    const h4 = main8.querySelector('h4');
    if (h4) subheading = h4;
  }
  const contentRow = [];
  if (mainTitle) contentRow.push(mainTitle);
  if (subheading) contentRow.push(subheading);
  const cells = [
    ['Hero'],
    [heroImg ? heroImg : ''],
    [contentRow.length ? contentRow : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
