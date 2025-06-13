/* global WebImporter */
export default function parse(element, { document }) {
  // Get the image, if present
  const imgEl = element.querySelector('.cmp-teaser__image img');

  // Compose the content (heading, description, CTA)
  const content = document.createElement('div');

  // Use the original heading element if present
  const heading = element.querySelector('.cmp-teaser__title');
  if (heading) {
    content.appendChild(heading);
  }

  // Add description if present
  const desc = element.querySelector('.cmp-teaser__description');
  if (desc) {
    content.appendChild(desc);
  }

  // Add CTA if present
  const cta = element.querySelector('.cmp-teaser__action-link');
  if (cta) {
    content.appendChild(cta);
  }

  // Build the table matching the example structure
  const cells = [
    ['Hero'],
    [imgEl || ''],
    [content],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
