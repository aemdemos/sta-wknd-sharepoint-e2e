/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser component
  let teaser = element.querySelector('.cmp-teaser--hero');
  if (!teaser) {
    // fallback: just cmp-teaser
    teaser = element.querySelector('.cmp-teaser');
  }
  if (!teaser) return;

  // Get the background image (the visual hero image)
  let imageElem = null;
  const teaserImageContainer = teaser.querySelector('.cmp-teaser__image');
  if (teaserImageContainer) {
    const img = teaserImageContainer.querySelector('img');
    if (img) imageElem = img;
  }

  // Get the title (headline)
  let headingElem = null;
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    headingElem = teaserContent.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Build the table rows
  const rows = [];
  // Row 1: Header row (block name)
  rows.push(['Hero (hero6)']);
  // Row 2: Background image only
  rows.push([imageElem ? imageElem : '']);
  // Row 3: Title (if present)
  rows.push([headingElem ? headingElem : '']);

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
