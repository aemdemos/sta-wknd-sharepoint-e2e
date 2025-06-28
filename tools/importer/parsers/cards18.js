/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main contentfragment area
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;
  const contentContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!contentContainer) return;

  // All h2s (card titles)
  const h2s = Array.from(contentContainer.querySelectorAll('h2.cmp-title__text'));

  const headerRow = ['Cards (cards18)'];
  const cells = [headerRow];

  h2s.forEach((h2, idx) => {
    // Find the image for this card: look for the first img after h2 in the DOM tree (not inside the title)
    let img = null;
    let ptr = h2.closest('.cmp-title').parentElement.nextElementSibling;
    while (ptr && !img) {
      if (ptr.querySelector && ptr.querySelector('img')) {
        img = ptr.querySelector('img');
        break;
      }
      ptr = ptr.nextElementSibling;
    }
    // If not found and this is the last card, search globally for the last image in this section
    if (!img && idx === h2s.length - 1) {
      const imgs = contentContainer.querySelectorAll('img');
      if (imgs.length) img = imgs[imgs.length - 1];
    }

    // Collect all the text content for the card: start from the first <p> after h2 up to the next h2 or end
    const textParts = [];
    let node = h2.closest('.cmp-title').parentElement.nextElementSibling;
    while (node) {
      // Stop if we reach another h2 (next card)
      const nextH2 = node.querySelector && node.querySelector('h2.cmp-title__text');
      if (nextH2) break;
      // Collect <p> and <div> blocks that are not img containers
      if ((node.tagName === 'P' || node.tagName === 'DIV') && !node.querySelector('img')) {
        textParts.push(node);
      }
      node = node.nextElementSibling;
    }

    // Compose text cell: Title as <strong>, then all subsequent content
    const textCell = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = h2.textContent;
    textCell.appendChild(strong);
    textParts.forEach((el) => {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(el);
    });

    cells.push([img, textCell]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
