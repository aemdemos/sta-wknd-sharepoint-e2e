/* global WebImporter */
export default function parse(element, { document }) {
  // Safely find the 'All Articles' section's image-list (cards)
  // 1. Find the h2 with text 'All Articles'
  // 2. Find the next .image-list sibling

  // Step 1: Find the 'All Articles' header
  const allTitles = element.querySelectorAll('h2.cmp-title__text');
  let allArticlesTitle = null;
  for (const t of allTitles) {
    if (t.textContent.trim() === 'All Articles') {
      allArticlesTitle = t;
      break;
    }
  }
  if (!allArticlesTitle) return;
  // Step 2: Traverse to the image-list after the 'All Articles' header
  let imageListDiv = allArticlesTitle.closest('.title').nextElementSibling;
  while (imageListDiv && !imageListDiv.classList.contains('image-list')) {
    imageListDiv = imageListDiv.nextElementSibling;
  }
  if (!imageListDiv) return;

  // Step 3: Get all li.cmp-image-list__item
  const ul = imageListDiv.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const lis = ul.querySelectorAll('li.cmp-image-list__item');

  // Step 4: Build the block table
  const rows = [];
  rows.push(['Cards (cards4)']); // Header row matches example exactly

  lis.forEach(li => {
    // First cell: the image
    let imgTag = li.querySelector('img');
    let imgElem = imgTag || li.querySelector('[data-cmp-is="image"]');

    // Second cell: text content
    // Title: .cmp-image-list__item-title (used for heading)
    // Description: .cmp-image-list__item-description
    // Link: .cmp-image-list__item-title-link (wraps the title)
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('span.cmp-image-list__item-title');
    const descriptionSpan = li.querySelector('span.cmp-image-list__item-description');

    // Construct heading (using <strong> for bold as in example)
    let titleElem = null;
    if (titleSpan) {
      if (titleLink) {
        // If title is a link, use the link but ensure textContent comes from the span
        const aElem = titleLink;
        aElem.textContent = titleSpan.textContent.trim();
        titleElem = document.createElement('strong');
        titleElem.appendChild(aElem);
      } else {
        titleElem = document.createElement('strong');
        titleElem.textContent = titleSpan.textContent.trim();
      }
    }

    // Compose the cell
    const textCell = document.createElement('div');
    if (titleElem) textCell.appendChild(titleElem);
    if (descriptionSpan) {
      // Add a <br> if both title and description
      if (titleElem) textCell.appendChild(document.createElement('br'));
      textCell.appendChild(descriptionSpan);
    }
    rows.push([
      imgElem,
      textCell
    ]);
  });

  // Replace the image list block with the constructed table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  imageListDiv.replaceWith(block);
}
