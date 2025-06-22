/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, as shown in the example markdown
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Find all direct card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li');

  items.forEach((item) => {
    // Card image: first <img> descendant
    const img = item.querySelector('img');

    // Card title: inside .cmp-image-list__item-title-link > .cmp-image-list__item-title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleElem = null;
    if (titleLink) {
      titleElem = titleLink.querySelector('.cmp-image-list__item-title');
    }

    // Card description: .cmp-image-list__item-description
    const descElem = item.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCell = [];
    if (titleElem && titleLink && titleLink.getAttribute('href')) {
      // Bold, linked title (using <strong><a>)
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href');
      a.textContent = titleElem.textContent;
      strong.appendChild(a);
      textCell.push(strong);
    } else if (titleElem) {
      // Bold title without link
      const strong = document.createElement('strong');
      strong.textContent = titleElem.textContent;
      textCell.push(strong);
    }
    if (descElem) {
      // Add line break then description (use existing element ref)
      textCell.push(document.createElement('br'));
      textCell.push(descElem);
    }

    // Each row: [image, text content]
    cells.push([
      img ? img : '',
      textCell.length ? textCell : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
