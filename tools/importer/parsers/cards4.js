/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text content from a card li
  function extractCardContent(li) {
    // Find the image element
    const img = li.querySelector('img');
    // Find the title (as a link)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Find the description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    // Compose text cell
    const textCell = document.createElement('div');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent.trim();
      textCell.appendChild(h3);
    }
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textCell.appendChild(p);
    }
    // Add CTA if present (only if the link is not already used for the title)
    // In this design, the title is the link, so no separate CTA needed
    return [img, textCell.childNodes.length ? textCell : ''];
  }

  // Find the image-list block
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;
  const ul = imageList.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const lis = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Build table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];
  lis.forEach(li => {
    rows.push(extractCardContent(li));
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original image-list block
  imageList.replaceWith(block);
}
