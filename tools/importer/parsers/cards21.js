/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Defensive: find the image-list block
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Get all image-list items
  const items = imageList.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // Each item contains an article
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Find the image (always present)
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imageLink) {
      // Use the <img> element directly
      imageEl = imageLink.querySelector('img');
    }

    // Find the title (always present)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleText = '';
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      }
    }

    // Find the description (optional)
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    let descText = '';
    if (descSpan) {
      descText = descSpan.textContent.trim();
    }

    // Compose the text cell
    const textCell = document.createElement('div');
    if (titleText) {
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      textCell.appendChild(heading);
    }
    if (descText) {
      const descP = document.createElement('p');
      descP.textContent = descText;
      textCell.appendChild(descP);
    }

    // Compose the row: [image, text]
    const row = [imageEl, textCell];
    rows.push(row);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
