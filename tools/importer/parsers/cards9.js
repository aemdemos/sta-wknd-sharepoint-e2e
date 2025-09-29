/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image, title, description, and CTA from an image-list item
  function extractCardFromImageListItem(item) {
    // Image: find <img> inside the item
    const img = item.querySelector('img');
    // Title: find .cmp-image-list__item-title
    const titleEl = item.querySelector('.cmp-image-list__item-title');
    // Description: find .cmp-image-list__item-description
    const descEl = item.querySelector('.cmp-image-list__item-description');
    // CTA: find the first .cmp-image-list__item-title-link (same as title link)
    const ctaLink = item.querySelector('.cmp-image-list__item-title-link');
    
    // Compose text cell: title (as heading), description, CTA (if present)
    const textCell = [];
    if (titleEl) {
      const h = document.createElement('h3');
      h.textContent = titleEl.textContent.trim();
      textCell.push(h);
    }
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.push(p);
    }
    // Only add CTA if it's not redundant with the title link
    // (in this design, the title is the CTA)
    // But for block completeness, add a CTA if present and not redundant
    // We'll skip it here as the title is already a link
    return [img, textCell];
  }

  // Find the image-list block
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;
  const ul = imageList.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards9)']);
  // Each card row
  items.forEach(item => {
    rows.push(extractCardFromImageListItem(item));
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageList.replaceWith(table);
}
