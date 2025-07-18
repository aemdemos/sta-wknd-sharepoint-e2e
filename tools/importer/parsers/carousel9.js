/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Carousel block, exactly matching the example
  const headerRow = ['Carousel (carousel9)'];

  // Find the content container and image container
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const imageDiv = element.querySelector('.cmp-teaser__image');
  const teaserImage = imageDiv ? imageDiv.querySelector('img') : null;

  // Prepare image cell using existing image element
  const imageCell = teaserImage || '';

  // Prepare text cell referencing existing elements
  const textCellEls = [];
  if (teaserContent) {
    // Heading
    const titleEl = teaserContent.querySelector('.cmp-teaser__title');
    if (titleEl && titleEl.textContent.trim()) {
      // Use the heading element as-is for semantic accuracy
      textCellEls.push(titleEl);
    }
    // Description
    const descEl = teaserContent.querySelector('.cmp-teaser__description');
    if (descEl && descEl.textContent.trim()) {
      textCellEls.push(descEl);
    }
    // CTA action
    const ctaEl = teaserContent.querySelector('.cmp-teaser__action-link');
    if (ctaEl && ctaEl.textContent.trim()) {
      textCellEls.push(ctaEl);
    }
  }

  // Only add the second cell if any text content exists
  const row = [imageCell];
  if (textCellEls.length > 0) {
    row.push(textCellEls);
  }

  // Build cells array (table): header row, then slide row
  const cells = [headerRow, row];

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
