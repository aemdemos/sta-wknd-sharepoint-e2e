/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top-level cmp-teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // --- Get the background image (row 2) ---
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  // If imageEl is missing, we'll put an empty string for that row cell

  // --- Get the content (row 3) ---
  // Should include title (heading), subheading, paragraph, cta, etc. as present
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  const contentCell = [];
  if (contentContainer) {
    // Title: look for h1-h6
    const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentCell.push(heading);
    // Subheading: look for next heading, must be a lower level than the title
    const allHeadings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (allHeadings.length > 1) {
      for (let i = 1; i < allHeadings.length; i++) {
        contentCell.push(allHeadings[i]);
      }
    }
    // Paragraphs
    const paras = contentContainer.querySelectorAll('p');
    paras.forEach(p => contentCell.push(p));
    // CTA links
    const links = contentContainer.querySelectorAll('a');
    links.forEach(a => contentCell.push(a));
    // If nothing found, just use the contentContainer itself
    if (contentCell.length === 0) {
      contentCell.push(contentContainer);
    }
  } else {
    contentCell.push('');
  }

  // --- Table assembly ---
  const rows = [
    ['Hero (hero12)'],
    [imageEl || ''],
    [contentCell]
  ];

  // Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
