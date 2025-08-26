/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('article.contentfragment');
  if (!cf) return;

  // Get the contentfragment elements
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Find all headings for cards (h2)
  const h2s = Array.from(cfElements.querySelectorAll('h2'));

  // Compose card rows
  const rows = [['Cards (cards33)']];
  h2s.forEach((h2) => {
    // Find image corresponding to card (look in next siblings for .image)
    let img = null;
    let next = h2.nextElementSibling;
    while (next) {
      if (next.classList && next.classList.contains('aem-Grid')) {
        // Find actual .image inside the grid
        const imageDiv = next.querySelector('.image');
        if (imageDiv) {
          img = imageDiv.querySelector('img');
          if (img) break;
        }
      }
      next = next.nextElementSibling;
    }
    // If didn't find, try previous sibling (for edge cases)
    if (!img) {
      let prev = h2.previousElementSibling;
      while (prev) {
        if (prev.classList && prev.classList.contains('aem-Grid')) {
          const imageDiv = prev.querySelector('.image');
          if (imageDiv) {
            img = imageDiv.querySelector('img');
            if (img) break;
          }
        }
        prev = prev.previousElementSibling;
      }
    }
    // Find paragraph for description (first <p> after heading)
    let desc = null;
    let p = h2.nextElementSibling;
    while (p) {
      if (p.tagName === 'P') {
        desc = p;
        break;
      }
      p = p.nextElementSibling;
    }
    // Compose text cell: title (strong) and description
    if (img && desc) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = h2.textContent.trim();
      rows.push([img, [titleEl, desc]]);
    }
  });

  // Table only if cards found
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
