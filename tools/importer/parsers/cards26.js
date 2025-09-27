/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a heading element
  function createHeading(text) {
    const h = document.createElement('p');
    h.innerHTML = `<strong>${text}</strong>`;
    return h;
  }

  // Find all cards (li elements)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));

  const rows = [];
  // Header row as required
  rows.push(['Cards (cards26)']);

  items.forEach((item) => {
    // Image cell
    let imgEl = item.querySelector('.cmp-image-list__item-image img');
    // Defensive: if not found, leave cell empty
    let imageCell = imgEl ? imgEl : '';

    // Text cell: Title (as heading), Description (as paragraph), CTA (if any)
    const textParts = [];
    // Title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // If there's a link, wrap heading in a link
      if (titleLink && titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.appendChild(createHeading(titleSpan.textContent));
        textParts.push(a);
      } else {
        textParts.push(createHeading(titleSpan.textContent));
      }
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textParts.push(p);
    }
    // CTA: If the title link exists and is not already used as heading, add as CTA
    // (In this structure, the title link is the heading, so no separate CTA)
    
    rows.push([imageCell, textParts]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
