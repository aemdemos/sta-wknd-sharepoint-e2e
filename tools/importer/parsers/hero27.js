/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row for the table block
  const headerRow = ['Hero (hero27)'];

  // Find the background image (should be the only <img> in cmp-teaser__image)
  let imageCell = '';
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Compose the content cell (heading, subheading/description, CTA)
  const contentParts = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Title
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // Use original element, but as h1 for semantic meaning
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      contentParts.push(h1);
    }
    // Subheading/Description
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      // Use a <p> for the description
      const p = document.createElement('p');
      p.innerHTML = desc.innerHTML;
      contentParts.push(p);
    }
    // CTA button/link
    const cta = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentParts.push(cta);
    }
  }

  const cells = [
    headerRow,
    [imageCell],
    [contentParts]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
