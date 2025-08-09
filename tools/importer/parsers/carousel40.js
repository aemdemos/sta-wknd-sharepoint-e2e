/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly as required
  const headerRow = ['Carousel (carousel40)'];

  // Find image (mandatory)
  let img = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    img = imageDiv.querySelector('img');
  }

  // Gather the text content cell
  const textCell = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // pretitle (optional)
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textCell.push(pretitle);
    }
    // title (optional)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textCell.push(title);
    }
    // description (optional)
    const description = contentDiv.querySelector('.cmp-teaser__description');
    if (description && description.textContent.trim()) {
      textCell.push(description);
    }
    // CTA (optional)
    const actionContainer = contentDiv.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('.cmp-teaser__action-link');
      if (cta && cta.textContent.trim()) {
        textCell.push(cta);
      }
    }
  }

  // Build the table
  const rows = [headerRow];
  if (img || textCell.length > 0) {
    rows.push([img, textCell]);
  }

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
