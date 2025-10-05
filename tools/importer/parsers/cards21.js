/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Defensive: find the image list container
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Find all card items (li elements)
  const items = imageList.querySelectorAll('li.cmp-image-list__item');

  items.forEach((li) => {
    // Find the image element
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }

    // Find the title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = null;
    if (titleLink) {
      titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
    }

    // Find the description
    const descSpan = li.querySelector('.cmp-image-list__item-description');

    // Compose the text cell
    const textCell = [];
    if (titleSpan) {
      // Create heading element for title
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      textCell.push(heading);
    }
    if (descSpan) {
      // Add description below heading
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCell.push(descP);
    }
    // Optionally, add CTA if needed (not present in source)

    // Compose row: [image, text]
    rows.push([
      imgEl,
      textCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
