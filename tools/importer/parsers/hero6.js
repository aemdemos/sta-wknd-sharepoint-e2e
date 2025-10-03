/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .cmp-container that contains the hero content
  const heroContainer = element.querySelector('.cmp-container');
  if (!heroContainer) return;

  // Find the .cmp-teaser inside the heroContainer
  const teaser = heroContainer.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the image element inside the teaser
  let imageEl = null;
  const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }

  // Compose the third row cell with all possible content: title, subheading, CTA
  const contentCell = document.createElement('div');
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Add all children (not just headline) to the cell
    Array.from(teaserContent.children).forEach((node) => {
      contentCell.appendChild(node.cloneNode(true));
    });
  }

  // Always create 3 rows: header, image, content
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell.childNodes.length ? contentCell : ''];

  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
