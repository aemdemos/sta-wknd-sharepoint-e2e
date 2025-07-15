/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to create the text cell for each card
  function createTextCell(titleLink, titleSpan, descSpan) {
    const frag = document.createElement('div');
    if (titleSpan) {
      // Title should have heading-like emphasis: use <strong>
      const strong = document.createElement('strong');
      // Move titleSpan node (do not clone)
      strong.appendChild(titleSpan);
      if (titleLink && titleLink.tagName === 'A') {
        // Wrap strong in the existing link
        titleLink.textContent = '';
        titleLink.appendChild(strong);
        frag.appendChild(titleLink);
      } else {
        frag.appendChild(strong);
      }
    }
    if (descSpan) {
      // Insert <br> between title and description if both exist
      if (frag.childNodes.length > 0) {
        frag.appendChild(document.createElement('br'));
      }
      frag.appendChild(descSpan);
    }
    return frag;
  }

  // Prepare the header row. Must match the example exactly.
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];

  // Select all li items representing cards
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((li) => {
    // Get the image (mandatory in first cell)
    let imageEl = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('.cmp-image-list__item-image img');
      if (img) {
        imageEl = img;
      }
    }
    // Get title and link
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = null;
    let linkEl = null;
    if (titleLink) {
      titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      linkEl = titleLink;
    }
    // Get description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    // Move the actual nodes rather than cloning
    // Remove the title and description from their parent so they're not duplicated
    if (titleSpan && titleSpan.parentNode) titleSpan.parentNode.removeChild(titleSpan);
    if (descSpan && descSpan.parentNode) descSpan.parentNode.removeChild(descSpan);
    // Use the existing linkEl for wrapping if present
    const textCell = createTextCell(linkEl, titleSpan, descSpan);
    // Add the row (image, text)
    rows.push([imageEl, textCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
