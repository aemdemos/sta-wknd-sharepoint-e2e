/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Find background image (second row)
  let imageEl = null;
  // Defensive: find the first <img> in the hero block
  const imgContainer = element.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    imageEl = imgContainer.querySelector('img');
  }

  // 3. Find content (third row)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentEls = [];
  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('.cmp-teaser__title');
    if (heading) contentEls.push(heading);
    // Description (subheading)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // CTA (call-to-action)
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentEls.push(ctaLink);
    }
  }

  // Table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEls]
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
