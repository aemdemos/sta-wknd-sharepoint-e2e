/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as in the example
  const headerRow = ['Columns (columns40)'];

  // Find the two main columns: image and content
  // Left: .cmp-teaser__content, Right: .cmp-teaser__image > img
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImageContainer = element.querySelector('.cmp-teaser__image');
  let teaserImage = null;
  if (teaserImageContainer) {
    teaserImage = teaserImageContainer.querySelector('img');
  }

  // Prepare left cell: All teaser content (pretitle, title, description, cta) as a vertical stack
  let leftCellContent = [];
  if (teaserContent) {
    // Use existing children to preserve order and meaning
    Array.from(teaserContent.children).forEach(child => {
      leftCellContent.push(child);
    });
  }

  // Right cell: Just the image tag (if present)
  let rightCellContent = [];
  if (teaserImage) {
    rightCellContent.push(teaserImage);
  }

  // Structure as two columns on the second row
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
