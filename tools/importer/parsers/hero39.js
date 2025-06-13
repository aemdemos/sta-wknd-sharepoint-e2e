/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the hero image, if present
  let image = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    image = imageContainer.querySelector('img');
  }

  // Extract the hero content (title, description)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentNodes = [];
  if (contentContainer) {
    // Heading (keep level/element as is)
    const heading = contentContainer.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) contentNodes.push(heading);
    // Description (could contain paragraphs)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.childNodes).forEach((child) => {
        // Instead of Node.TEXT_NODE, use 3
        if (
          child.nodeType !== 3 ||
          child.textContent.trim() !== ''
        ) {
          contentNodes.push(child);
        }
      });
    }
  }

  // Build the block table: header, image, then content
  const cells = [
    ['Hero'],
    [image || ''],
    [contentNodes.length ? contentNodes : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
