/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Get all card items
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // Find the image (first cell)
    let imageEl = null;
    const imageContainer = item.querySelector('.cmp-image-list__item-image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }

    // Find the text content (second cell)
    const textFragments = [];
    // Title (as heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use a heading element for semantic structure
      const heading = document.createElement('h3');
      heading.textContent = titleLink.textContent.trim();
      textFragments.push(heading);
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      textFragments.push(descP);
    }
    // CTA (if any)
    if (titleLink && titleLink.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.href = titleLink.getAttribute('href');
      cta.textContent = 'Read More';
      textFragments.push(cta);
    }

    // Compose the row
    const row = [imageEl, textFragments];
    rows.push(row);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original image-list block with the table
  imageList.closest('.image-list').replaceWith(table);
}
