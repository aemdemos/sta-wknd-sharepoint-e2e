/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we're working with the expected structure
  if (!element || !document) return;

  // Table header as specified
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  // Find all list items representing cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // Find the article containing card content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image element inside the image link
    let imageEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }
    // Defensive: fallback if image not found
    if (!imageEl) {
      // If no image, use an empty cell
      imageEl = document.createElement('span');
    }

    // --- TEXT CELL ---
    // Title (as heading)
    let titleText = '';
    let titleLink = null;
    const titleLinkEl = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLinkEl) {
      const titleSpan = titleLinkEl.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
        // Wrap title in <strong> for heading effect
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        // If the title is a link, wrap in <a>
        if (titleLinkEl.href) {
          const link = document.createElement('a');
          link.href = titleLinkEl.href;
          link.appendChild(strong);
          titleLink = link;
        } else {
          titleLink = strong;
        }
      }
    }

    // Description
    let descEl = null;
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent.trim();
    }

    // Compose text cell: title (heading), description
    const textCellContent = [];
    if (titleLink) textCellContent.push(titleLink);
    if (descEl) textCellContent.push(descEl);

    // Add the row for this card
    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
