/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always use block name
  const headerRow = ['Hero (hero26)'];

  // Defensive selectors for hero structure
  // 1. Find the image (background)
  let imgEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }

  // 2. Find the content (title, description, CTA)
  const contentContainer = element.querySelector('.cmp-teaser__content');

  // Title (h2)
  let titleEl = null;
  if (contentContainer) {
    titleEl = contentContainer.querySelector('h2');
  }

  // Description (div)
  let descEl = null;
  if (contentContainer) {
    descEl = contentContainer.querySelector('.cmp-teaser__description');
  }

  // CTA (link)
  let ctaEl = null;
  if (contentContainer) {
    const actionContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      ctaEl = actionContainer.querySelector('a');
    }
  }

  // 2nd row: image only (if exists)
  const imageRow = [imgEl ? imgEl : ''];

  // 3rd row: text content (title, description, CTA)
  const textContent = [];
  if (titleEl) textContent.push(titleEl);
  if (descEl) textContent.push(descEl);
  if (ctaEl) textContent.push(ctaEl);
  const contentRow = [textContent.length ? textContent : ''];

  // Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
