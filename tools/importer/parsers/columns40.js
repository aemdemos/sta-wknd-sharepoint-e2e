/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content and image columns
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const imageDiv = element.querySelector('.cmp-teaser__image');

  // Extract the image element
  let imgEl = null;
  if (imageDiv) {
    imgEl = imageDiv.querySelector('img');
  }

  // Compose the right column: pretitle, title, description, CTA
  let rightColumnEls = [];
  if (contentDiv) {
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    const title = contentDiv.querySelector('.cmp-teaser__title');
    const description = contentDiv.querySelector('.cmp-teaser__description');
    const ctaLink = contentDiv.querySelector('.cmp-teaser__action-link');
    if (pretitle) rightColumnEls.push(pretitle);
    if (title) rightColumnEls.push(title);
    if (description) rightColumnEls.push(description);
    if (ctaLink) rightColumnEls.push(ctaLink);
  }

  // Build the table rows
  const headerRow = ['Columns (columns40)'];
  const contentRow = [imgEl, rightColumnEls];
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
