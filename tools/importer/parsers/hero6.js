/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the first .cmp-teaser block inside the provided element
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Extract the background image
  let bgImg = null;
  const teaserImage = teaser.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    // Use the full cmp-teaser__image element as the cell contents
    bgImg = teaserImage;
  }

  // Extract content for the text row (usually heading/title)
  let contentElements = [];
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Include all child nodes (to allow for heading, subheading, etc if present)
    const children = Array.from(teaserContent.children);
    if (children.length > 0) {
      contentElements = children;
    }
  }

  // Compose header, image, and content rows as per block requirements
  const headerRow = ['Hero (hero6)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [contentElements.length > 0 ? contentElements : ''];

  // Compose table for block
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the referenced element in-place
  element.replaceWith(table);
}
