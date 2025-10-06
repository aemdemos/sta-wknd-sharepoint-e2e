/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create the text cell with title (as heading) and description
  function createTextCell(titleEl, descEl, linkHref) {
    const frag = document.createElement('div');
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      if (linkHref) {
        const a = document.createElement('a');
        a.href = linkHref;
        a.appendChild(h3);
        frag.appendChild(a);
      } else {
        frag.appendChild(h3);
      }
    }
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      frag.appendChild(p);
    }
    return frag;
  }

  // Start building table rows
  const rows = [];
  // Header row as per block spec
  rows.push(['Cards (cards27)']);

  // Find all card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    const items = ul.querySelectorAll('li.cmp-image-list__item');
    items.forEach((li) => {
      // Image cell
      let imgEl = null;
      const imgLink = li.querySelector('.cmp-image-list__item-image-link');
      if (imgLink) {
        // Find the <img> inside the image link
        imgEl = imgLink.querySelector('img');
      }
      // Text cell
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      const titleEl = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
      const descEl = li.querySelector('.cmp-image-list__item-description');
      const linkHref = titleLink ? titleLink.getAttribute('href') : null;
      const textCell = createTextCell(titleEl, descEl, linkHref);
      // Compose row
      rows.push([
        imgEl ? imgEl : '',
        textCell
      ]);
    });
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
