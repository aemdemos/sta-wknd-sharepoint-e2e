/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card li
  function getImage(li) {
    // Find the first <img> inside the li
    const img = li.querySelector('img');
    return img;
  }

  // Helper to extract the text content from a card li
  function getTextContent(li) {
    // Title: .cmp-image-list__item-title
    // Description: .cmp-image-list__item-description
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    // Compose a fragment with title as heading and description as paragraph
    const frag = document.createDocumentFragment();
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent.trim();
      frag.appendChild(h3);
    }
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      frag.appendChild(p);
    }
    return frag;
  }

  // Find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const lis = Array.from(ul.querySelectorAll(':scope > li'));

  // Build the table rows
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];
  lis.forEach((li) => {
    const img = getImage(li);
    const text = getTextContent(li);
    rows.push([img, text]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
