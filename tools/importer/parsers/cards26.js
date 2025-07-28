/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header row
  const headerRow = ['Cards (cards26)'];
  
  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  const rows = Array.from(items).map((li) => {
    // Get the image (img element)
    const img = li.querySelector('img');

    // Get the title link and title span
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Get the description
    const desc = li.querySelector('.cmp-image-list__item-description');

    // Compose content for the text cell
    const contentParts = [];
    if (titleSpan && titleSpan.textContent.trim()) {
      // Title as <strong>, with link if present
      let strongEl = document.createElement('strong');
      strongEl.textContent = titleSpan.textContent.trim();
      if (titleLink && titleLink.href) {
        const linkEl = document.createElement('a');
        linkEl.href = titleLink.href;
        linkEl.appendChild(strongEl);
        contentParts.push(linkEl);
      } else {
        contentParts.push(strongEl);
      }
    }
    if (desc && desc.textContent.trim()) {
      if (contentParts.length > 0) {
        contentParts.push(document.createElement('br'));
      }
      contentParts.push(desc);
    }

    // Make sure at least one cell is present in each row
    return [img, contentParts.length === 1 ? contentParts[0] : contentParts];
  });

  // Compose the table with header
  const cells = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
