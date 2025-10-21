/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards30) block parsing
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Find all card items
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardItems.forEach((item) => {
    // Image: always in the first cell
    let imageEl = item.querySelector('.cmp-image-list__item-image .cmp-image__image');
    // Defensive: fallback to any img inside the card
    if (!imageEl) {
      imageEl = item.querySelector('img');
    }

    // Text content: title, description, and link
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descriptionSpan = item.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCell = document.createElement('div');
    // Title (as heading, wrapped in link if present)
    if (titleSpan) {
      const heading = document.createElement('h3');
      if (titleLink) {
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.append(titleSpan.textContent);
        heading.append(link);
      } else {
        heading.textContent = titleSpan.textContent;
      }
      textCell.appendChild(heading);
    }
    // Description
    if (descriptionSpan) {
      const descP = document.createElement('p');
      descP.textContent = descriptionSpan.textContent;
      textCell.appendChild(descP);
    }
    // Optionally, add a CTA if there is a link and it's not already used for the title
    // (In this HTML, the title link is the CTA, so nothing extra needed)

    // Add row: [image, text]
    rows.push([imageEl, textCell]);
  });

  // Create and replace block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
