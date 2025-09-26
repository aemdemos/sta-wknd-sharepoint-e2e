/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to get immediate children with a selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Table header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = getDirectChildren(ul, 'li.cmp-image-list__item');

  items.forEach((li) => {
    // The card content is inside article
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // 1. Image cell
    // Find the image link, then the image element inside
    let imageCell = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('div.cmp-image-list__item-image');
      if (imageDiv) {
        const image = imageDiv.querySelector('img');
        if (image) {
          imageCell = image;
        }
      }
    }
    // Defensive: fallback to first img in article if structure changes
    if (!imageCell) {
      const fallbackImg = article.querySelector('img');
      if (fallbackImg) imageCell = fallbackImg;
    }
    if (!imageCell) imageCell = document.createTextNode('');

    // 2. Text cell
    // Title (as heading)
    let title = '';
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        title = titleSpan.textContent.trim();
      }
    }
    // Description
    let desc = '';
    const descSpan = article.querySelector('span.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      desc = descSpan.textContent.trim();
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (title) {
      const heading = document.createElement('strong');
      heading.textContent = title;
      textCell.appendChild(heading);
    }
    if (desc) {
      const para = document.createElement('div');
      para.textContent = desc;
      textCell.appendChild(para);
    }
    // Optionally, add CTA if present (not in this HTML, but block supports it)
    // Example: find a link that is not the image or title link
    // (not present here)

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
