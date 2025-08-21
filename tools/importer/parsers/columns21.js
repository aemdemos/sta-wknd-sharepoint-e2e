/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block
  const headerRow = ['Columns (columns21)'];

  // The structure in the example is two columns: image on left, all text on right.
  // - First column: Image
  // - Second column: All text content (pretitle, title, description, cta)
  // Extract the image element (can be the containing div for robustness)
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // Extract content block
  const teaserContent = element.querySelector('.cmp-teaser__content');

  // Defensive: if either is missing, use empty div
  const col1 = teaserImage || document.createElement('div');
  const col2 = teaserContent || document.createElement('div');

  // Create the columns row
  const columnsRow = [col1, col2];

  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
