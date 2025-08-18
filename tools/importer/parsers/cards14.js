/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example
  const headerRow = ['Cards (cards14)'];
  const rows = [];

  // Defensive: find all cards in the block
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach(item => {
    // Image: use the container div for semantic grouping if present
    let imageCell = null;
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      const imgContainer = imgLink.querySelector('.cmp-image-list__item-image');
      if (imgContainer) {
        imageCell = imgContainer; // Use the div, includes all meta/caption
      } else {
        // Fallback to image if container missing
        imageCell = imgLink.querySelector('img');
      }
    }
    // Defensive: handle missing image
    if (!imageCell) {
      imageCell = document.createElement('div');
      imageCell.textContent = '';
    }

    // Text cell: title (as <strong>) + description
    let titleContent = '';
    let descContent = '';
    // Title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent) {
        titleContent = titleSpan.textContent.trim();
      }
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent) {
      descContent = descSpan.textContent.trim();
    }
    // Title as <strong>
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleContent;
    // Description as <div> below title
    let textCell = [titleEl];
    if (descContent) {
      const descEl = document.createElement('div');
      descEl.textContent = descContent;
      textCell.push(descEl);
    }
    // No CTA in this example
    rows.push([imageCell, textCell]);
  });

  // Table creation exactly as required, header row matches, no Section Metadata block needed.
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
