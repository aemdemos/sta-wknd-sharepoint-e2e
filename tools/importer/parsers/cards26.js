/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards26)'];

  // Get all immediate card items (li elements)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [headerRow];

  cardItems.forEach((li) => {
    // Defensive: find the article containing card content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- Image cell ---
    // Find the image element inside the image link
    let imageEl = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }
    // Defensive: if no image, skip this card
    if (!imageEl) return;

    // --- Text cell ---
    // Title (inside link)
    let titleSpan = article.querySelector('span.cmp-image-list__item-title');
    let titleText = titleSpan ? titleSpan.textContent.trim() : '';
    // Description
    let descSpan = article.querySelector('span.cmp-image-list__item-description');
    let descText = descSpan ? descSpan.textContent.trim() : '';
    // Link (call-to-action)
    let ctaLink = article.querySelector('a.cmp-image-list__item-title-link');

    // Build text cell content
    const textCellContent = [];
    if (titleText) {
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      textCellContent.push(heading);
    }
    if (descText) {
      const descP = document.createElement('p');
      descP.textContent = descText;
      textCellContent.push(descP);
    }
    // Only add CTA if link exists and is not redundant
    if (ctaLink && ctaLink.href && ctaLink.textContent && ctaLink.textContent.trim() !== titleText) {
      const linkEl = document.createElement('a');
      linkEl.href = ctaLink.href;
      linkEl.textContent = ctaLink.textContent.trim();
      textCellContent.push(linkEl);
    }

    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
