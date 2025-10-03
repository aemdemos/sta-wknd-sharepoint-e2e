/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  // Defensive: find the list container
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // For each card item
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: find the article content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image inside the nested structure
    let img = article.querySelector('a.cmp-image-list__item-image-link img');
    // Use the <img> element directly if found
    let imageCell = img || '';

    // --- TEXT CELL ---
    // Title (inside a link)
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    let title = '';
    if (titleLink) {
      // Use the span inside the link as the title
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        // Create a heading element for the title
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent;
        title = h3;
      }
    }
    // Description
    const descSpan = article.querySelector('span.cmp-image-list__item-description');
    let desc = '';
    if (descSpan) {
      // Use a <p> for the description
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      desc = p;
    }
    // CTA (use the title link as CTA if present)
    let cta = '';
    // Only add CTA if the link has an href and is not just the title
    // (But in this design, CTA is optional and not present in the example)
    // Compose text cell content
    const cellContent = [];
    if (title) cellContent.push(title);
    if (desc) cellContent.push(desc);
    // Add the row: [image, text content]
    rows.push([imageCell, cellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
