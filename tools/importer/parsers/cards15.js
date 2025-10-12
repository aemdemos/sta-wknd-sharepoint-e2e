/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block: 2 columns, multiple rows, each row = card (image + text)
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Find all card items (li.cmp-image-list__item)
  const cardItems = element.querySelectorAll('li.cmp-image-list__item');

  cardItems.forEach((item) => {
    // Image: find the <img> inside the card
    const img = item.querySelector('img');

    // Text content: title (as heading with link), description, and image caption if present
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const description = item.querySelector('.cmp-image-list__item-description');
    // For image caption (if present, e.g., <meta itemprop="caption"> or title attribute)
    let imgCaption = '';
    if (img) {
      if (img.hasAttribute('title')) {
        imgCaption = img.getAttribute('title');
      } else {
        // Try to find <meta itemprop="caption">
        const metaCaption = img.parentElement && img.parentElement.querySelector('meta[itemprop="caption"]');
        if (metaCaption) {
          imgCaption = metaCaption.getAttribute('content') || '';
        }
      }
    }

    // Compose text cell
    const textCell = document.createElement('div');
    // Title as heading (h3) with link
    if (titleSpan && titleLink && titleLink.href) {
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.textContent = titleSpan.textContent;
      heading.appendChild(link);
      textCell.appendChild(heading);
    }
    // Description
    if (description) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent;
      textCell.appendChild(descP);
    }
    // Image caption (if present and not duplicate of description)
    if (imgCaption && (!description || imgCaption !== description.textContent)) {
      const captionP = document.createElement('p');
      captionP.textContent = imgCaption;
      textCell.appendChild(captionP);
    }

    // Add row: [image, text]
    rows.push([
      img,
      textCell
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
