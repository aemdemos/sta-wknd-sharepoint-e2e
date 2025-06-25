/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards27)'];
  const rows = [];

  // Select all card items in the image list
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Image: find <img> inside .cmp-image-list__item-image
    const imgDiv = item.querySelector('.cmp-image-list__item-image');
    let image = null;
    if (imgDiv) {
      image = imgDiv.querySelector('img');
    }

    // Text cell content: strong title, description
    // Get title: always inside .cmp-image-list__item-title (inside a link)
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    // Get description
    const desc = item.querySelector('.cmp-image-list__item-description');

    // Build contents of the text cell
    const textParts = [];
    if (titleSpan && titleSpan.textContent.trim()) {
      // Use <strong> for the title
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textParts.push(strong);
    }
    if (desc && desc.textContent.trim()) {
      // Add a <br> if there's a title before
      if (textParts.length > 0) {
        textParts.push(document.createElement('br'));
      }
      textParts.push(desc);
    }
    // If neither, textParts will be empty

    rows.push([
      image,
      textParts
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace the element with the table
  element.replaceWith(table);
}
