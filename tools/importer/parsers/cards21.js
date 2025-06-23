/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if there's a card list
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach(li => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    // --- IMAGE CELL ---
    let imageCell = null;
    const imgLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      // The image is inside the link, which contains a div with the image
      const imageDiv = imgLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        } else {
          imageCell = imageDiv;
        }
      } else {
        imageCell = imgLink;
      }
    }
    // --- CONTENT CELL ---
    // Create a container for the card's content
    const content = document.createElement('div');
    // Title: Use strong tag, wrapped in link if present
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    if (titleLink && titleSpan) {
      // Use the actual link element from the DOM, but clear its contents and re-add the strong
      const link = titleLink;
      // Remove all children first (if any)
      while (link.firstChild) link.removeChild(link.firstChild);
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      link.appendChild(heading);
      content.appendChild(link);
      content.appendChild(document.createElement('br'));
    } else if (titleSpan) {
      // fallback: just strong without link
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      content.appendChild(heading);
      content.appendChild(document.createElement('br'));
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      content.appendChild(desc);
    }
    rows.push([imageCell, content]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
