/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the image list container
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Build header row
  const cells = [['Cards (cards21)']];

  // Process each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Get image from the first image in the card
    let image = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      image = imageLink.querySelector('img');
    }

    // Build text cell: Title (as <strong>), description (as <div>), optional CTA if present
    const textCell = [];
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.push(strong);
    }
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textCell.push(descDiv);
    }
    // Optional: If the title link is a real CTA and not just the heading, add at the bottom (not needed for this structure)

    cells.push([image, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
