/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image element for the left column
  const teaserImage = element.querySelector('.cmp-teaser__image img');
  const imageCell = teaserImage ? teaserImage.cloneNode(true) : document.createTextNode('');

  // Extract all teaser content for the right column, as a single flat array of nodes (not wrapped in a div)
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const rightCol = [];
  if (teaserContent) {
    Array.from(teaserContent.children).forEach(child => {
      // Only push the actual content elements, not the wrapper
      rightCol.push(child.cloneNode(true));
    });
  }

  // Compose the table
  const headerRow = ['Columns (columns40)'];
  const cells = [headerRow, [imageCell, ...rightCol.length === 1 ? [rightCol[0]] : [rightCol]]];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
