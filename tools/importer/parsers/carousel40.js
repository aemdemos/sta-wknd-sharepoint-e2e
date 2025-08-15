/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Carousel (carousel40)'];

  // Extract image (first column)
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img'); // Reference the existing <img>
  }

  // Extract text content (second column)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const textCellContent = [];
  if (contentDiv) {
    // Featured label (pretitle)
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textCellContent.push(pretitle); // Keep as <p>
    }

    // Title, keep heading level
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textCellContent.push(title); // already <h2>
    }

    // Description, keep <div>
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textCellContent.push(desc);
    }

    // CTA if present
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      textCellContent.push(cta);
    }
  }

  // If the text cell has at least one element, pass the array, else pass empty string
  const row = [imageEl || '', textCellContent.length ? textCellContent : ''];
  const cells = [headerRow, row];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
