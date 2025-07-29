/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero image at the top of the main grid
  let heroImg = null;
  const container = element.querySelector(':scope > div.cmp-container');
  if (container) {
    const grid = container.querySelector(':scope > div.aem-Grid');
    if (grid) {
      const imageDiv = grid.querySelector(':scope > div.image .cmp-image img');
      if (imageDiv) heroImg = imageDiv;
    }
  }

  // 2. Find the main headline (h1) and byline (h4) from the main content area (the nested main)
  let mainTitle = null;
  let mainByline = null;
  const innerMain = element.querySelector(':scope > main.container.responsivegrid');
  if (innerMain) {
    mainTitle = innerMain.querySelector('h1');
    mainByline = innerMain.querySelector('h4');
  }

  // 3. Compose just the heading(s) and byline for the hero text cell
  const textCell = [];
  if (mainTitle) textCell.push(mainTitle);
  if (mainByline) textCell.push(mainByline);

  // 4. Compose table cells for hero block
  const cells = [
    ['Hero (hero38)'],
    [heroImg ? heroImg : ''],
    [textCell.length > 0 ? textCell : '']
  ];

  // 5. Replace the original element with the new block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
