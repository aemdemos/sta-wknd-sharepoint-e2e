/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block which represents the cards
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  const cards = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));

  const headerRow = ['Cards (cards4)'];
  const rows = cards.map((card) => {
    // Get image (reference the img element)
    const imgContainer = card.querySelector('.cmp-image-list__item-image');
    let image = null;
    if (imgContainer) {
      image = imgContainer.querySelector('img');
    }

    // Get title (reference the span inside the link, keep as span)
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      // Reference the span element directly
      titleEl = titleLink.querySelector('.cmp-image-list__item-title');
    }
    // Get description
    const desc = card.querySelector('.cmp-image-list__item-description');

    // Compose the text cell
    const textCell = [];
    if (titleEl) {
      // If the title is inside a link, wrap the span in a link
      const linkHref = titleLink && titleLink.getAttribute('href');
      if (linkHref) {
        // Move the span into a link reference
        const link = document.createElement('a');
        link.href = linkHref;
        link.appendChild(titleEl);
        textCell.push(link);
      } else {
        textCell.push(titleEl);
      }
    }
    if (desc) {
      if (textCell.length) textCell.push(document.createElement('br'));
      textCell.push(desc);
    }
    return [image, textCell];
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the image-list block with the table
  imageList.parentElement.replaceWith(table);
}
