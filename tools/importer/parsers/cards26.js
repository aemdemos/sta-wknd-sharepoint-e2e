/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) table
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];
  // Find all card <li> elements directly under the list
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardItems.forEach((li) => {
    // Image (first cell)
    const img = li.querySelector('.cmp-image-list__item-image img');
    // use the <img> element directly, or null if not present
    const imageCell = img || '';
    // Text content (second cell)
    const textCell = [];
    // Title: get the <span> inside the title link, wrap in <strong>, and add link if present
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      if (titleLink.getAttribute('href')) {
        // Wrap in a link
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.appendChild(strong);
        textCell.push(a);
      } else {
        textCell.push(strong);
      }
    }
    // Description: get from <span class="cmp-image-list__item-description">
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      textCell.push(descP);
    }
    cells.push([imageCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
