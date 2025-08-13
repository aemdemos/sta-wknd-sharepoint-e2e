/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block header
  const headerRow = ['Cards (cards26)'];
  const rows = [];

  // Get all LI items (cards)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  lis.forEach((li) => {
    // Extract image (reference existing <img> element)
    let img = null;
    const imgDiv = li.querySelector('.cmp-image-list__item-image .cmp-image');
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }

    // Extract title (reference existing <span> element, wrap in strong and preserve link)
    let title = null;
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        // preserve link
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.appendChild(strong);
        title = link;
      }
    }

    // Extract description (reference existing <span> and preserve all text)
    let description = null;
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Using a div to keep it visually below the title, as in markdown
      description = document.createElement('div');
      description.textContent = descSpan.textContent;
    }

    // Combine title and description into one cell
    const contentCell = [];
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);

    rows.push([
      img,
      contentCell
    ]);
  });

  // Final table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
