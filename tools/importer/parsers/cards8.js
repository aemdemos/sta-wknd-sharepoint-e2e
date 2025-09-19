/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create the text content cell for each card
  function createTextCell(titleLink, description) {
    const cell = document.createElement('div');
    if (titleLink) {
      // Use heading style for title
      const heading = document.createElement('p');
      heading.appendChild(titleLink);
      heading.style.fontWeight = 'bold';
      cell.appendChild(heading);
    }
    if (description) {
      const desc = document.createElement('p');
      desc.appendChild(description);
      cell.appendChild(desc);
    }
    return cell;
  }

  // Get all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [];
  // Header row
  rows.push(['Cards (cards8)']);

  items.forEach((item) => {
    // Image: find the first <img> inside the image link
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    let image = null;
    if (imageLink) {
      image = imageLink.querySelector('img');
    }

    // Title: use the text inside .cmp-image-list__item-title, but wrap in <strong> or <p> as heading
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleNode = null;
    if (titleLink) {
      // Clone the link and its text
      const clonedLink = titleLink.cloneNode(true);
      // Optionally, make the text bold
      const span = clonedLink.querySelector('.cmp-image-list__item-title');
      if (span) {
        span.style.fontWeight = 'bold';
      }
      titleNode = clonedLink;
    }

    // Description
    const description = item.querySelector('.cmp-image-list__item-description');
    let descNode = null;
    if (description) {
      descNode = description.cloneNode(true);
    }

    // Build the row: [image, text cell]
    const imgCell = image ? image : '';
    const textCell = createTextCell(titleNode, descNode);
    rows.push([imgCell, textCell]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
