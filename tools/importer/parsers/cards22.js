/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a text cell with title and description
  function createTextCell(titleEl, descEl, linkHref) {
    const fragment = document.createDocumentFragment();
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      if (linkHref) {
        const a = document.createElement('a');
        a.href = linkHref;
        a.appendChild(h3);
        fragment.appendChild(a);
      } else {
        fragment.appendChild(h3);
      }
    }
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      fragment.appendChild(p);
    }
    return fragment;
  }

  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Find the image list
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((li) => {
    // Image cell
    let imgEl = null;
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }
    // Title and description
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    const linkHref = titleLink ? titleLink.getAttribute('href') : null;
    // Compose text cell
    const textCell = createTextCell(titleSpan, descSpan, linkHref);
    // Build row
    rows.push([
      imgEl,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
