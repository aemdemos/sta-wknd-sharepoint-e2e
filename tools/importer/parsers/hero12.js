/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero (teaser) block
  const teaser = element.querySelector('.cmp-teaser');
  let img = null;
  let content = null;
  if (teaser) {
    // Find the image inside the teaser
    const imgWrapper = teaser.querySelector('.cmp-teaser__image');
    if (imgWrapper) {
      img = imgWrapper.querySelector('img');
    }
    // Find the content inside the teaser (usually h2 or h1)
    const contentWrapper = teaser.querySelector('.cmp-teaser__content');
    if (contentWrapper) {
      // Including all heading and paragraph content for robustness
      // Get all block-level content (headings, paragraphs, etc.)
      // The example shows only the main heading in the hero, so only keep the first block-level content
      const blocks = Array.from(contentWrapper.children).filter(el =>
        /^H[1-6]$/.test(el.tagName) || el.tagName === 'P' || el.tagName === 'DIV'
      );
      if (blocks.length > 0) {
        content = blocks[0];
      }
    }
  }

  // Prepare rows for the block table
  const rows = [];
  // Header row - exactly as in markdown example: Hero
  rows.push(['Hero']);
  // Second row - image if present, else blank
  rows.push([img ? img : '']);
  // Third row - content if present, else blank
  rows.push([content ? content : '']);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
