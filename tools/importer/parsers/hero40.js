/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image (optional)
  let imageCell = '';
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Extract content: pretitle, title, description, CTA (all optional)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentElements = [];
  if (contentDiv) {
    // Pretitle (subheading), if present
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      contentElements.push(pretitle);
    }
    // Main heading (title)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // Ensure heading is h1, as per Hero block
      let heading = title;
      if (title.tagName.toLowerCase() !== 'h1') {
        // Replace with h1, but reference the same text
        heading = document.createElement('h1');
        heading.innerHTML = title.innerHTML;
      }
      contentElements.push(heading);
    }
    // Description (optional)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      contentElements.push(desc);
    }
    // CTA (optional)
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      contentElements.push(cta);
    }
  }

  // Build table as per example: 1 col, 3 rows. Header is 'Hero' (no formatting)
  const cells = [
    ['Hero'],
    [imageCell],
    [contentElements]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
