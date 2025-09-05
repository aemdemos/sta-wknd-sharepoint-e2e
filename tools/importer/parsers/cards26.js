/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the UL containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Get all LI items (cards)
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // Defensive: find the article
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the image inside the image link
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const cmpImage = imageDiv.querySelector('.cmp-image');
        if (cmpImage) {
          const img = cmpImage.querySelector('img');
          if (img) {
            imageCell = img;
          }
        }
      }
    }
    // Defensive fallback: if no image found, skip this card
    if (!imageCell) return;

    // Text cell: build a fragment with title and description
    const textCell = document.createElement('div');
    // Title (as heading)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textCell.appendChild(heading);
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCell.appendChild(descP);
    }
    // CTA: If the title link exists, add it as a link at the bottom
    if (titleLink && titleLink.href) {
      // Only add CTA if not already used for the heading
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textCell.appendChild(cta);
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
