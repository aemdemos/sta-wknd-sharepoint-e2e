/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  // Table header row
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // For each card
  items.forEach((li) => {
    // Defensive: get the article content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the first <img> in the card
    let img = article.querySelector('img');
    // Defensive: if image is wrapped in a link, use the image only
    let imageCell = img ? img : '';

    // Text cell: build a fragment with title (as heading) and description
    const frag = document.createElement('div');
    // Title
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for heading style, or create <h3> if needed
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('strong');
        heading.textContent = titleSpan.textContent;
        frag.appendChild(heading);
      }
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      frag.appendChild(document.createElement('br'));
      frag.appendChild(descDiv);
    }
    // CTA: not present in this HTML, but if present, add here
    // (No extra code needed for now)

    rows.push([imageCell, frag]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
