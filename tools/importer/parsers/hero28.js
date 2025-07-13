/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Hero (hero28)'];

  // Get the background image (img inside cmp-teaser__image)
  let imageCell = '';
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Gather text content: title, description, CTA
  const contentParts = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // The order is: Title (as heading), Description, CTA (link)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }

  // Build table rows: header, image, content
  const cells = [
    headerRow,
    [imageCell],
    [contentParts]
  ];

  // Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
