/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the main teaser content and image containers
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // Defensive: fallback if not found
  if (!teaserContent && !teaserImage) return;

  // Table header row as required
  const headerRow = ['Columns (columns20)'];

  // First column: image (use the whole .cmp-teaser__image block)
  // Second column: content (use the whole .cmp-teaser__content block)
  const contentRow = [
    teaserImage,
    teaserContent,
  ];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
