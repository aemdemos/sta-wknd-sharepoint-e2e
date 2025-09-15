/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the UL containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header as per block spec
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Each LI is a card
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    // Find image (first cell)
    let imageEl = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Defensive: find the image inside the link
      imageEl = imageLink.querySelector('img');
      if (!imageEl) {
        // fallback: use the image container
        imageEl = imageLink.querySelector('.cmp-image');
      }
    }

    // Text content (second cell)
    const textContent = document.createElement('div');
    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use heading for title
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textContent.appendChild(heading);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textContent.appendChild(descP);
    }
    // CTA (use title link if present)
    if (titleLink && titleLink.href) {
      // Only add CTA if link is not just for image
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textContent.appendChild(cta);
    }

    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
