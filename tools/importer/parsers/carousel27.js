/* global WebImporter */
export default function parse(element, { document }) {
  // Build the Carousel (carousel27) block table as per the provided HTML and example

  // 1. Table header row
  const headerRow = ['Carousel (carousel27)'];

  // 2. Find the image for the slide (first cell)
  let imageCell = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    // Look for the first <img> tag inside
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      // If not found, just use the image wrapper div
      imageCell = teaserImageDiv;
    }
  }

  // 3. Compose the text cell (second cell): title, description, CTA
  const cellContent = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Title (keep as heading as in source)
    const title = contentDiv.querySelector('.cmp-teaser__title, h2, h3, h4, h5, h6');
    if (title) cellContent.push(title);
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) cellContent.push(desc);
    // CTA
    const ctaContainer = contentDiv.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      // There might be multiple links, but use all
      const ctas = Array.from(ctaContainer.querySelectorAll('a'));
      cellContent.push(...ctas);
    }
  }

  // Edge case: If all text cell content is missing, ensure an empty array (still a column)
  const slideRow = [imageCell, cellContent];

  // 4. Build the table for the block
  const table = [headerRow, slideRow];
  const block = WebImporter.DOMUtils.createTable(table, document);

  // 5. Replace the original element
  element.replaceWith(block);
}
