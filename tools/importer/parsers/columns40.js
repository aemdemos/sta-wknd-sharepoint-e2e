/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get immediate children
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find content and image columns
  let contentCol, imageCol;
  children.forEach((child) => {
    if (child.classList.contains('cmp-teaser__content')) {
      contentCol = child;
    } else if (child.classList.contains('cmp-teaser__image')) {
      imageCol = child;
    }
  });

  // Fallback: If not found, try deeper
  if (!contentCol || !imageCol) {
    const teaser = element.querySelector('.cmp-teaser');
    if (teaser) {
      contentCol = teaser.querySelector('.cmp-teaser__content');
      imageCol = teaser.querySelector('.cmp-teaser__image');
    }
  }

  // Defensive: If still not found, skip
  if (!contentCol || !imageCol) return;

  // --- Compose content column ---
  // Gather all content elements
  const contentEls = [];
  // Pretitle
  const pretitle = contentCol.querySelector('.cmp-teaser__pretitle');
  if (pretitle) contentEls.push(pretitle);
  // Title
  const title = contentCol.querySelector('.cmp-teaser__title');
  if (title) contentEls.push(title);
  // Description
  const desc = contentCol.querySelector('.cmp-teaser__description');
  if (desc) contentEls.push(desc);
  // CTA
  const actionContainer = contentCol.querySelector('.cmp-teaser__action-container');
  if (actionContainer) {
    // Use the link directly
    const ctaLink = actionContainer.querySelector('a');
    if (ctaLink) contentEls.push(ctaLink);
  }

  // --- Compose image column ---
  // Find the actual image element
  let imgEl = imageCol.querySelector('img');
  let imageEls = [];
  if (imgEl) {
    imageEls.push(imgEl);
  }

  // --- Build table rows ---
  const headerRow = ['Columns (columns40)'];
  const contentRow = [contentEls, imageEls];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace element
  element.replaceWith(table);
}
