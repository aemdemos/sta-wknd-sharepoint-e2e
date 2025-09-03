/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for the expected UL structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    // Defensive: find the article
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image link (contains the image)
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    let imageCell = '';
    if (imageLink) {
      // Find the actual image element inside
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    // Title (as heading)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let textCellContent = [];
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create heading element
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textCellContent.push(heading);
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Use a paragraph for description
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCellContent.push(descP);
    }
    // Call-to-action (link)
    if (titleLink && titleLink.href) {
      // Only add CTA if the link is not just for the title
      // In this structure, the title itself is the link, so we can add it as CTA if needed
      // But only if not already present as heading
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textCellContent.push(cta);
    }

    // Compose row: [image, text]
    rows.push([
      imageCell,
      textCellContent,
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
