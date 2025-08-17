/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Defensive: find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // IMAGE CELL: Find actual img element (reference from doc)
    let imgEl = null;
    const imgHolder = item.querySelector('.cmp-image-list__item-image');
    if (imgHolder) {
      imgEl = imgHolder.querySelector('img');
    }
    // TEXT CELL: Compose heading (h3, not hardcoded), description, link
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let heading; // heading is always present
    if (titleLink) {
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span) {
        // Use h3 for heading as in example structure
        heading = document.createElement('h3');
        heading.textContent = span.textContent;
        // If the heading is wrapped with a link, preserve it
        if (titleLink.getAttribute('href')) {
          const a = document.createElement('a');
          a.href = titleLink.getAttribute('href');
          a.append(heading);
          heading = a;
        }
      }
    }
    // Description (optional)
    let descP = null;
    const descEl = item.querySelector('.cmp-image-list__item-description');
    if (descEl && descEl.textContent.trim()) {
      descP = document.createElement('p');
      descP.textContent = descEl.textContent.trim();
    }
    // Compose text cell: heading followed by description (only if exists)
    const textCell = [];
    if (heading) textCell.push(heading);
    if (descP) textCell.push(descP);
    // Add the row only if img and text exist
    if (imgEl && textCell.length > 0) {
      cells.push([imgEl, textCell]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
