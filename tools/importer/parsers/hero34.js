/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image at the top (first .image in main container)
  let heroImage = null;
  const mainImageDiv = element.querySelector('.image');
  if (mainImageDiv) {
    heroImage = mainImageDiv.querySelector('img');
  }
  if (!heroImage) {
    heroImage = element.querySelector('img');
  }

  // Find the main title and subheading
  let title = '';
  let subheading = '';
  const h1 = element.querySelector('h1');
  if (h1) title = h1.textContent.trim();
  const h4 = element.querySelector('h4');
  if (h4) subheading = h4.textContent.trim();

  // Compose the text cell content (include all text content)
  const textCell = [];
  if (title) {
    const h1El = document.createElement('h1');
    h1El.textContent = title;
    textCell.push(h1El);
  }
  if (subheading) {
    const h4El = document.createElement('h4');
    h4El.textContent = subheading;
    textCell.push(h4El);
  }

  // Table header must match block name exactly
  const headerRow = ['Hero (hero34)'];
  const imageRow = [heroImage ? heroImage : ''];
  const textRow = [textCell.length ? textCell : ''];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable([headerRow, imageRow, textRow], document);

  // Replace the original element with the block
  element.replaceWith(block);
}
