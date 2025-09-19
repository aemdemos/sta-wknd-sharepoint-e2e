/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Defensive: find the image list container
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Find all card items
  const items = imageList.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // Find image (always present)
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }
    // Defensive fallback: if no image, skip this card
    if (!imageEl) return;

    // Find title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleText = '';
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      }
    }

    // Find description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    let descText = '';
    if (descSpan) {
      descText = descSpan.textContent.trim();
    }

    // Compose text cell
    const textCell = document.createElement('div');
    if (titleText) {
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      textCell.appendChild(heading);
    }
    if (descText) {
      const descP = document.createElement('div');
      descP.textContent = descText;
      textCell.appendChild(descP);
    }
    // Optionally, add CTA link if present (not in this source)
    // if (titleLink && titleLink.href) {
    //   const cta = document.createElement('a');
    //   cta.href = titleLink.href;
    //   cta.textContent = 'Learn more';
    //   textCell.appendChild(cta);
    // }

    // Add row: [image, text]
    rows.push([imageEl, textCell]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
