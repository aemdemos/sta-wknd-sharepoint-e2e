/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block (cards4)
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;
  const cards = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));
  const rows = [['Cards (cards4)']]; // Header row exactly as in the example

  cards.forEach(card => {
    // Image cell
    let imageEl = null;
    const imgDiv = card.querySelector('.cmp-image-list__item-image');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) imageEl = img;
    }

    // Text cell: heading with link (if present), description
    const textElems = [];
    // Title (with link)
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> if present in original, else h3 as in original HTML visually
        const h = document.createElement('strong');
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.innerHTML = titleSpan.innerHTML;
        h.appendChild(a);
        textElems.push(h);
      }
    }

    // Description (always below heading)
    const desc = card.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textElems.push(p);
    }
    rows.push([imageEl, textElems]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageList.parentElement.replaceWith(table);
}
