/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, matching the example exactly
  const headerRow = ['Cards (cards21)'];
  // Locate the image list containing the card items
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  const items = imageList ? Array.from(imageList.children) : [];

  function getCardRow(item) {
    // Find the first image element for the card
    const img = item.querySelector('img');
    // Find the title (as a span) and description (as a span)
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Prepare the text cell
    let textCell;
    if (titleSpan && descSpan) {
      // Use strong for the title, then a <br>, then the description
      // Use document fragments to avoid cloning, reference existing nodes if possible
      const frag = document.createDocumentFragment();
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
      frag.appendChild(document.createTextNode(descSpan.textContent));
      textCell = frag;
    } else if (titleSpan) {
      // Only title
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCell = strong;
    } else if (descSpan) {
      // Only description
      textCell = document.createTextNode(descSpan.textContent);
    } else {
      textCell = '';
    }
    return [img, textCell];
  }

  // Build the table rows: header + one row per card
  const cells = [headerRow, ...items.map(getCardRow)];
  // Create the block table using the provided helper
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
