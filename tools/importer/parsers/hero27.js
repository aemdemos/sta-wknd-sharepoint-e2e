/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser content and image containers
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const imageDiv = element.querySelector('.cmp-teaser__image');

  // --- Row 2: Image ---
  let imageEl = null;
  if (imageDiv) {
    // Reference the existing <img> element for the hero image
    const img = imageDiv.querySelector('img');
    if (img) imageEl = img;
  }

  // --- Row 3: Content ---
  const contentEls = [];
  if (contentDiv) {
    // Heading (as h2)
    const heading = contentDiv.querySelector('.cmp-teaser__title');
    if (heading) contentEls.push(heading);
    // Description (as div)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // CTA (as anchor)
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentEls.push(cta);
  }

  // Compose table rows
  const headerRow = ['Hero (hero27)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
