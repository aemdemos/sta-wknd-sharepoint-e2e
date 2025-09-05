/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image at the top (first .image > img)
  let heroImage = '';
  const topImageDiv = element.querySelector('.image');
  if (topImageDiv) {
    const img = topImageDiv.querySelector('img');
    if (img) heroImage = img;
  }

  // Find the main title (first h1 inside any .cmp-title)
  let title = '';
  const titleDiv = element.querySelector('h1');
  if (titleDiv) title = titleDiv;

  // Find the subheading (first h4 inside any .cmp-title)
  let subheading = '';
  const subheadingDiv = element.querySelector('h4');
  if (subheadingDiv) subheading = subheadingDiv;

  // Find a call-to-action (first .cmp-button, if present)
  let cta = '';
  const ctaButton = element.querySelector('.cmp-button');
  if (ctaButton) cta = ctaButton;

  // Compose the content cell for row 3
  const contentCell = [];
  if (title) contentCell.push(title);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  // Build the table rows
  const headerRow = ['Hero (hero32)'];
  const imageRow = [heroImage ? heroImage : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
