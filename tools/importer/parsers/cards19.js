/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required by the block spec
  const headerRow = ['Cards (cards19)'];

  // Find the list of cards
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  // Build rows for each card
  const rows = Array.from(imageList.children).map((li) => {
    // Defensive: find the content container
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return null;

    // Find the image (first cell)
    let imageEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the <img> inside the image link
      imageEl = imageLink.querySelector('img');
    }

    // Find the title (as heading) and description (second cell)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descriptionSpan = article.querySelector('.cmp-image-list__item-description');

    // Compose the text cell
    const textCell = [];
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      textCell.push(h3);
    }
    if (descriptionSpan) {
      const p = document.createElement('p');
      p.textContent = descriptionSpan.textContent;
      textCell.push(p);
    }
    // Optionally, add a CTA link if present (not in this source, but spec allows)
    // if (titleLink && titleLink.href) {
    //   const cta = document.createElement('a');
    //   cta.href = titleLink.href;
    //   cta.textContent = 'Learn more';
    //   textCell.push(cta);
    // }

    return [imageEl, textCell];
  }).filter(Boolean);

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
