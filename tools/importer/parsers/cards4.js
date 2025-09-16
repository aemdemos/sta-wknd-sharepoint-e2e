/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  // Header row as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: find the article
    const article = li.querySelector(':scope > article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell
    let imageEl = null;
    const img = article.querySelector('img');
    if (img) {
      imageEl = img.cloneNode(true);
    }

    // Text cell: collect all text content in order
    const cellContent = [];
    // Title (as heading)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent;
        cellContent.push(h3);
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Use textContent to ensure all text is included
      const desc = document.createElement('p');
      desc.textContent = descSpan.textContent;
      cellContent.push(desc);
    }
    // CTA (use the title link as CTA if present and has href)
    if (titleLink && titleLink.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.href = titleLink.getAttribute('href');
      cta.textContent = 'Read More';
      cellContent.push(cta);
    }

    // Add row: [image, text content]
    rows.push([
      imageEl || '',
      cellContent
    ]);
  });

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
