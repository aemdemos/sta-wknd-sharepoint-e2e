/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists and is a list block
  if (!element || !element.querySelector('ul.cmp-image-list')) return;

  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Get all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Get image (first cell)
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageEl = img;
        }
      }
    }

    // Get text content (second cell)
    const textContent = [];
    // Title (as heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textContent.push(heading);
      }
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textContent.push(descP);
    }
    // Call-to-action (use title link if present)
    if (titleLink && titleLink.href) {
      // Only add CTA if not already present as heading
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textContent.push(cta);
    }

    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
