/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image, title, description, and link from a card item
  function extractCardData(li) {
    // Image: find the <img> inside the image link
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    let img = null;
    if (imgLink) {
      img = imgLink.querySelector('img');
    }

    // Title: find the <span class="cmp-image-list__item-title"> inside the title link
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let title = null;
    let linkHref = null;
    if (titleLink) {
      title = titleLink.querySelector('.cmp-image-list__item-title');
      linkHref = titleLink.getAttribute('href');
    }

    // Description: <span class="cmp-image-list__item-description">
    const desc = li.querySelector('.cmp-image-list__item-description');

    // Build the text cell: title (as heading, optionally linked), description
    const textCell = document.createElement('div');
    if (title) {
      const h3 = document.createElement('h3');
      if (linkHref) {
        const a = document.createElement('a');
        a.href = linkHref;
        a.append(title.textContent);
        h3.append(a);
      } else {
        h3.textContent = title.textContent;
      }
      textCell.appendChild(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCell.appendChild(p);
    }
    return [img, textCell];
  }

  // Find all card items
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards20)']);
  // Card rows
  items.forEach((li) => {
    rows.push(extractCardData(li));
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
