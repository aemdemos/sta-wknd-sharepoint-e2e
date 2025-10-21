/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct child divs
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find the main teaser block
  const teaser = children.find((child) => child.classList.contains('cmp-teaser')) || element;

  // --- HEADER ROW ---
  const headerRow = ['Hero (hero27)'];

  // --- IMAGE ROW ---
  // Find image inside teaser
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  // Defensive: If no image found, leave cell empty
  const imageRow = [imageEl ? imageEl : ''];

  // --- CONTENT ROW ---
  // Find content container
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let contentParts = [];
  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('.cmp-teaser__title');
    if (heading) contentParts.push(heading);

    // Description
    const description = contentContainer.querySelector('.cmp-teaser__description');
    if (description) contentParts.push(description);

    // CTA link
    const actionContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('a');
      if (cta) contentParts.push(cta);
    }
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // --- BUILD TABLE ---
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
