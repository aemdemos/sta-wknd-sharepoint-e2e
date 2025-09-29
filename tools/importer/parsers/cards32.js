/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards32)'];

  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  // Build rows for each card
  const rows = Array.from(items).map((item) => {
    // Image: find the <img> inside the image link
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }

    // Title: find the title span inside the title link
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      titleEl = titleLink.querySelector('.cmp-image-list__item-title');
    }

    // Description: find the description span
    const descEl = item.querySelector('.cmp-image-list__item-description');

    // Compose the text cell: Title (bold), Description (normal)
    const textCell = document.createElement('div');
    if (titleEl) {
      const heading = document.createElement('strong');
      heading.textContent = titleEl.textContent;
      textCell.appendChild(heading);
    }
    if (descEl) {
      textCell.appendChild(document.createElement('br'));
      const descSpan = document.createElement('span');
      descSpan.textContent = descEl.textContent;
      textCell.appendChild(descSpan);
    }
    // Optionally add CTA if titleLink exists (not required by screenshot, but block allows)
    // For this source, the title itself is already a link, so we could wrap the heading in the link
    if (titleLink && titleEl) {
      const ctaLink = document.createElement('a');
      ctaLink.href = titleLink.getAttribute('href');
      ctaLink.textContent = titleEl.textContent;
      ctaLink.style.display = 'none'; // Hide, since not visually present in screenshot
      textCell.appendChild(ctaLink);
    }

    // Compose row: [image, text]
    return [imgEl, textCell];
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
