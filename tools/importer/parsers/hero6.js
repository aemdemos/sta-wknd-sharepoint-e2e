/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser
  const teaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');

  let img = null;
  let textContentArr = [];

  if (teaser) {
    // 1. Get image (background): img element inside cmp-teaser__image
    const imageDiv = teaser.querySelector('.cmp-teaser__image .cmp-image');
    if (imageDiv) {
      const possibleImg = imageDiv.querySelector('img');
      if (possibleImg) img = possibleImg;
    }
    // 2. Get textual content: all children of cmp-teaser__content
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content) {
      // Only include elements or significant text nodes
      textContentArr = Array.from(content.childNodes).filter((node) => {
        if (node.nodeType === 1) return true;
        if (node.nodeType === 3 && node.textContent.trim().length > 0) return true;
        return false;
      });
    }
  }

  // Compose the table per block definition
  const cells = [];
  cells.push(['Hero (hero6)']); // header row
  cells.push([img ? img : '']); // image row
  cells.push([textContentArr.length > 0 ? textContentArr : '']); // content row

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
