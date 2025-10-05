/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image, title, description, and link from a card item
  function extractCardContent(li) {
    // Find the image element
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }

    // Find the title and link
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleText = '';
    let titleEl = null;
    if (titleLink) {
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span) {
        titleText = span.textContent.trim();
        // Create heading element for title
        titleEl = document.createElement('strong');
        titleEl.textContent = titleText;
      }
    }

    // Find description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent.trim();
    }

    // Compose text cell: title (heading), description, and CTA (if any)
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);
    // Optionally add CTA link at bottom (use titleLink if present)
    // Only add if the link is not just the image link
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textCellContent.push(cta);
    }

    return [imgEl, textCellContent];
  }

  // Table header row
  const headerRow = ['Cards (cards26)'];

  // Find all card items
  const ul = element.querySelector('ul.cmp-image-list');
  const lis = ul ? Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item')) : [];

  // Build rows for each card
  const rows = lis.map((li) => {
    const [imgEl, textCellContent] = extractCardContent(li);
    // Defensive: ensure image is present
    return [imgEl, textCellContent];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element with block table
  element.replaceWith(block);
}
