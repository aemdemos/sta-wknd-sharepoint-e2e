/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image, title, description, and CTA from a card node
  function extractCardFromImageListItem(li) {
    const img = li.querySelector('img');
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const title = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const desc = li.querySelector('.cmp-image-list__item-description');
    // Compose text cell: title (strong), description, link (if present)
    const textCell = document.createElement('div');
    if (title) {
      const h = document.createElement('strong');
      h.textContent = title.textContent;
      textCell.appendChild(h);
    }
    if (desc) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(document.createTextNode(desc.textContent));
    }
    // Add CTA link if present and not duplicate
    if (titleLink && titleLink.href) {
      textCell.appendChild(document.createElement('br'));
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = titleLink.textContent;
      textCell.appendChild(cta);
    }
    return [img, textCell];
  }

  // Find the image-list block
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;
  const items = imageList.querySelectorAll('li.cmp-image-list__item');

  // Compose table rows
  const rows = [];
  const headerRow = ['Cards (cards4)'];
  rows.push(headerRow);

  items.forEach((li) => {
    const [img, textCell] = extractCardFromImageListItem(li);
    // Ensure all text content from the li is included (fallback for missing description)
    if ((!textCell.textContent.trim()) && li.textContent.trim()) {
      textCell.textContent = li.textContent.trim();
    }
    if (img && textCell.textContent.trim().length > 0) {
      rows.push([img, textCell]);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
