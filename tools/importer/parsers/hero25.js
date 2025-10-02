/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get all direct children
  const children = Array.from(element.querySelectorAll(':scope > *'));

  // Find the main teaser content block
  let teaser = element.querySelector('.cmp-teaser');
  if (!teaser) teaser = element; // fallback

  // Find image element
  let imageDiv = teaser.querySelector('.cmp-teaser__image');
  let imgEl = imageDiv && imageDiv.querySelector('img');

  // Find content (title + description)
  let contentDiv = teaser.querySelector('.cmp-teaser__content');
  let titleEl = contentDiv && contentDiv.querySelector('.cmp-teaser__title');
  let descDiv = contentDiv && contentDiv.querySelector('.cmp-teaser__description');

  // Compose table rows
  const headerRow = ['Hero (hero25)'];
  const imageRow = [imgEl ? imgEl : ''];
  // Compose content cell: Title (heading), then description (subheading)
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (descDiv) contentCell.push(descDiv);
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
