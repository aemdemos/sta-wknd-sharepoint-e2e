/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList && el.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero19)'];

  // 2. Image row
  // Find the image element (deep descendant)
  let imgEl = element.querySelector('img');
  let imageRow = [imgEl ? imgEl : ''];

  // 3. Content row
  // Find the content container
  let contentContainer = getDirectChildByClass(element, 'cmp-teaser');
  if (!contentContainer) contentContainer = element;
  let content = getDirectChildByClass(contentContainer, 'cmp-teaser__content');
  if (!content) content = contentContainer;

  // Title
  let title = content.querySelector('.cmp-teaser__title');
  // Description
  let desc = content.querySelector('.cmp-teaser__description');
  // CTA (could be missing)
  let cta = content.querySelector('.cmp-teaser__action-link');

  // Compose content cell
  const contentCell = [];
  if (title) contentCell.push(title);
  if (desc) contentCell.push(desc);
  if (cta) contentCell.push(cta);

  // Always wrap in a div for consistent block output
  let contentDiv = document.createElement('div');
  contentCell.forEach((el) => {
    if (el) contentDiv.appendChild(el);
  });

  const contentRow = [contentDiv];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
