/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a <li.cmp-image-list__item>
  function extractCard(li) {
    // Image: find the <img> inside the image link
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }

    // Title: find the <span.cmp-image-list__item-title> (inside a link)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      titleEl = titleLink.querySelector('.cmp-image-list__item-title');
    }

    // Description: <span.cmp-image-list__item-description>
    const descEl = li.querySelector('.cmp-image-list__item-description');

    // Compose text cell: title (strong), then description
    const textCell = [];
    if (titleEl) {
      // Use <strong> for heading style
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      textCell.push(strong);
    }
    if (descEl) {
      // Add a <div> for description (preserves line breaks if any)
      const descDiv = document.createElement('div');
      descDiv.textContent = descEl.textContent;
      textCell.push(descDiv);
    }

    return [imageEl, textCell];
  }

  // Find the <ul class="cmp-image-list"> inside the element
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Build table rows
  const rows = [];
  // Header row as required
  rows.push(['Cards (cards40)']);

  // For each card (li)
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    rows.push(extractCard(li));
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
