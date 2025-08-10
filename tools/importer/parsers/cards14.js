/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match example
  const headerRow = ['Cards (cards14)'];

  // Get all <li> cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.children).filter(li => li.classList.contains('cmp-image-list__item'));

  // Helper to build the text cell content, referencing existing elements
  function buildTextCell(item) {
    // Title (as heading, link if present)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    const frag = document.createDocumentFragment();
    if (titleLink && titleSpan) {
      // Use <strong> for heading and wrap in link if present
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      if (titleLink.hasAttribute('href')) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.appendChild(strong);
        frag.appendChild(a);
      } else {
        frag.appendChild(strong);
      }
    }
    if (descSpan) {
      // Use a <p> for description, as in example
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      frag.appendChild(p);
    }
    return frag.childNodes.length ? Array.from(frag.childNodes) : '';
  }

  // Each card: [Image, Text]
  const rows = items.map(item => {
    // Find the image
    let imageCell = '';
    const img = item.querySelector('.cmp-image-list__item-image img');
    if (img) {
      imageCell = img;
    }
    // Text
    const textCell = buildTextCell(item);
    return [imageCell, textCell];
  });

  // Compose cells array for the block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
