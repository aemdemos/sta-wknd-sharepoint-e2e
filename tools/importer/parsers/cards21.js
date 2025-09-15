/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image-list container
  const imageList = element.querySelector('.image-list.list > .cmp-image-list');
  if (!imageList) return;

  // Build the header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: Find the article
    const article = li.querySelector(':scope > article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the image inside the image-link
    let imageCell = '';
    const imageLink = article.querySelector(':scope > a.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the image element inside the image link
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text cell: build a div with title and description
    const textCellContent = [];
    // Title (as heading)
    const titleLink = article.querySelector(':scope > a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent;
        textCellContent.push(h3);
      }
    }
    // Description
    const desc = article.querySelector(':scope > .cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCellContent.push(p);
    }
    // CTA: If the title link exists, add it as a CTA at the bottom (if not already used as heading)
    // (In this design, the title is the only link, so we do not duplicate it as a CTA)

    rows.push([
      imageCell,
      textCellContent,
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
