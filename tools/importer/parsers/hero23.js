/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');

  // Prepare table header
  const headerRow = ['Hero (hero23)'];

  // Prepare image row
  let imageElem = null;
  if (heroTeaser) {
    const imageBlock = heroTeaser.querySelector('.cmp-teaser__image .cmp-image img');
    if (imageBlock) {
      imageElem = imageBlock;
    }
  }
  // Always keep the image in a cell (even if null, as per structure)
  const imageRow = [imageElem];

  // Prepare content row (e.g., heading/title)
  let textContent = [];
  if (heroTeaser) {
    const content = heroTeaser.querySelector('.cmp-teaser__content');
    if (content) {
      // If there are multiple elements (e.g., subtitle, CTA), include them all
      const children = Array.from(content.children);
      if (children.length > 0) {
        textContent = children;
      }
    }
  }
  // The cell should be an array (empty if not found)
  const contentRow = [textContent];

  // Build the table
  const rows = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
