/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as required
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find the image list container
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) {
    // Defensive: If not found, do nothing
    return;
  }

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Find the image (first cell)
    let imageEl = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the img inside the image link
      imageEl = imageLink.querySelector('img');
    }

    // Find the text content (second cell)
    const textFragments = [];
    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create a heading element for the title
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent.trim();
        textFragments.push(h3);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textFragments.push(p);
    }
    // CTA (use the title link if present)
    if (titleLink && titleLink.href) {
      // Only add CTA if the link is not just a wrapper for the title
      // We'll add it as a link at the bottom
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Learn more';
      textFragments.push(cta);
    }

    // Build the row: [image, text content]
    const row = [imageEl, textFragments];
    rows.push(row);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
