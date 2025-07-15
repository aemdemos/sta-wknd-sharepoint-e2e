/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards31)'];
  const cells = [headerRow];

  // Process each card in the image list
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((li) => {
    // IMAGE CELL
    let imageEl = null;
    const imageContainer = li.querySelector('.cmp-image-list__item-image');
    if (imageContainer) {
      // Use the direct child img element as the image for the card
      imageEl = imageContainer.querySelector('img');
    }

    // TEXT CELL
    const textParts = [];
    // Title (bold/heading style)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for visual similarity to example (heading-like, but not a heading)
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textParts.push(strong);
      }
    }
    // Description (below heading)
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Add in a <div> or <span> for spacing beneath the title if present
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      textParts.push(descDiv);
    }
    // Output as [image, textContent]
    cells.push([imageEl, textParts]);
  });

  // Create and replace with the new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
