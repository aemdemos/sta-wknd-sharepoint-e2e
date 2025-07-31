/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example: 'Hero (hero40)'
  const headerRow = ['Hero (hero40)'];

  // Find the background image: .cmp-teaser__image img
  let imageEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Even if imageEl is missing, provide an empty cell for robustness
  const imageRow = [imageEl || ''];

  // Now get the content: pretitle, title (h2), description, CTA
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  const contentNodes = [];
  if (contentWrapper) {
    // Subheading (pretitle)
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      contentNodes.push(pretitle);
    }
    // Title (Heading, usually h2)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      contentNodes.push(title);
    }
    // Description (often a <div>)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      contentNodes.push(desc);
    }
    // CTA (optional link)
    const cta = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentNodes.push(cta);
    }
  }
  // Always provide an array in the content cell
  const contentRow = [contentNodes];

  // Compose the table with 1 column, 3 rows (header, image, content)
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
