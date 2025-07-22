/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per requirements
  const headerRow = ['Hero (hero10)'];

  // Find the hero/teaser block
  // The structure is: element -> div.cmp-container -> div.teaser.cmp-teaser--hero -> div#teaser-...cmp-teaser
  // Or simply: .cmp-teaser--hero or .cmp-teaser
  let teaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  if (!teaser) {
    // If for any reason teaser not found, fail gracefully
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      [''],
      ['']
    ], document);
    element.replaceWith(table);
    return;
  }

  // Background image row
  let imgEl = null;
  const teaserImg = teaser.querySelector('.cmp-teaser__image img');
  if (teaserImg) {
    imgEl = teaserImg;
  }
  const imageRow = [imgEl ? imgEl : ''];

  // Content row: Heading, subheading, CTA (in this case: heading only)
  let contentElements = [];
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Reference all *direct* children (e.g., h2, p, etc.)
    contentElements = Array.from(teaserContent.children);
  }
  const contentRow = [contentElements.length ? contentElements : ''];

  // Compose the block table as required (header, image row, content row)
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
