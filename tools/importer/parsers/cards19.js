/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block spec
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];

  // Find the image-list UL
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // For each card/item
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Find the article (card content)
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the first <img> inside the image-link
    let imgCell = '';
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imgCell = img;
    }

    // Text cell: title (as heading) + description
    const textContent = [];
    // Title (as <strong> or <h3>)
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textContent.push(strong);
      }
    }
    // Description
    const desc = article.querySelector('span.cmp-image-list__item-description');
    if (desc) {
      // Add a <br> if title exists
      if (textContent.length) textContent.push(document.createElement('br'));
      textContent.push(desc);
    }

    rows.push([imgCell, textContent]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
