/* global WebImporter */
export default function parse(element, { document }) {
  // Block name as header row (must match exactly)
  const headerRow = ['Hero (hero39)'];

  // Get the background image (optional)
  let bgImg = '';
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      bgImg = img;
    }
  }

  // Compose the title & description content (title, subheading, CTA)
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const contentNodes = [];
  if (teaserContent) {
    // Title (use as is; keep heading level)
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) contentNodes.push(title);
    // Description, push all element children of description block
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          contentNodes.push(node);
        }
      });
    }
  }

  // Build the table rows.
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentNodes.length > 0 ? contentNodes : ''],
  ];

  // Create the block and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
