/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find card list items
  const items = element.querySelectorAll('.cmp-image-list__item');
  items.forEach((item) => {
    // Find article (holds all card content)
    const article = item.querySelector('.cmp-image-list__item-content');
    
    // ----- Image cell -----
    let imgEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Use the first <img> inside the image link
      imgEl = imageLink.querySelector('img');
    }

    // ----- Text cell -----
    const textParts = [];

    // Title: use the text inside <span class="cmp-image-list__item-title">, wrap in <strong>
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textParts.push(strong);
    }

    // Description: text inside <span class="cmp-image-list__item-description">
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      // Add a <br> between title and description if both exist
      if (textParts.length > 0) {
        textParts.push(document.createElement('br'));
      }
      // Add the description as a Text Node to preserve HTML semantics
      textParts.push(descSpan.cloneNode(true));
    }
    
    // Add the card row: [image, text cell]
    rows.push([
      imgEl,
      textParts.length === 1 ? textParts[0] : textParts
    ]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
