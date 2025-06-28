/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block as in the example
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Defensive: Find the single <ul> of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // IMAGE CELL
    // Reference the <img> element directly (do not clone)
    const img = li.querySelector('img');

    // TEXT CELL
    const textFragments = [];
    // Title as strong, with link if present
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      let strong = document.createElement('strong');
      if (titleLink) {
        // Make a link using the href and the text from the span
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.textContent = titleSpan.textContent.trim();
        strong.appendChild(a);
      } else {
        strong.textContent = titleSpan.textContent.trim();
      }
      textFragments.push(strong);
    }
    // Description (if present)
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Add a <br> if there is a title
      if (textFragments.length) textFragments.push(document.createElement('br'));
      // The description is always plain text, use <span> or <p>
      const desc = document.createElement('span');
      desc.textContent = descSpan.textContent.trim();
      textFragments.push(desc);
    }

    // Compose the row
    rows.push([
      img,
      textFragments
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
