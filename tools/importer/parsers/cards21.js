/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];

  // Find the list with all the cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;

  // Loop through each card item
  list.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Image: Find the first img in the card
    const img = li.querySelector('img');
    
    // Prepare text cell
    const textCell = [];

    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for the title, with the <a> as child if present
      const strong = document.createElement('strong');
      // Reference the actual link node (do not clone)
      if (titleLink.parentElement === li.querySelector('article')) {
        // Remove the link from the DOM so we don't double-insert
        titleLink.remove();
      }
      strong.appendChild(titleLink);
      textCell.push(strong);
      textCell.push(document.createElement('br'));
    }

    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Use a <p> for the description
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCell.push(p);
    }
    
    cells.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
