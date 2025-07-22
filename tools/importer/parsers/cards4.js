/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block
  const imageList = element.querySelector('.image-list ul.cmp-image-list');
  if (!imageList) return;
  const cards = Array.from(imageList.children).filter(li => li.tagName === 'LI');
  if (!cards.length) return;

  const rows = [['Cards (cards4)']]; // Header row exactly as in example

  cards.forEach(card => {
    // --- Image cell ---
    // Find the first <img> anywhere in the card, referencing the existing element
    const img = card.querySelector('img');

    // --- Text content cell ---
    // Compose text block from the title and description, preserving semantic meaning
    const textCell = document.createElement('div');

    // Title: place in a <strong> as per example
    let title = card.querySelector('.cmp-image-list__item-title-link .cmp-image-list__item-title');
    if (!title) {
      title = card.querySelector('.cmp-image-list__item-title');
    }
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    // Description, as plain text node (no extra markup)
    const desc = card.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      textCell.appendChild(document.createTextNode(desc.textContent.trim()));
    }
    // Edge case: if no title or description, try to get other text content
    if (!textCell.textContent.trim()) {
      // Fallback: get all text that is not in an <img> or <a>
      const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          // Exclude text in <a> or <img>
          let parent = node.parentNode;
          while (parent && parent !== card) {
            if (parent.tagName === 'A' || parent.tagName === 'IMG') return NodeFilter.FILTER_REJECT;
            parent = parent.parentNode;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let txt = '';
      let n;
      while ((n = walker.nextNode())) {
        if (n.textContent.trim()) {
          txt += n.textContent.trim() + ' ';
        }
      }
      if (txt.trim()) {
        textCell.appendChild(document.createTextNode(txt.trim()));
      }
    }
    // Only add the row if we have at least one cell with content
    rows.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
