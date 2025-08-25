/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the image list corresponding to 'All Articles'
  const imageList = element.querySelector('.image-list.list .cmp-image-list');
  if (!imageList) return;

  const cells = [['Cards (cards4)']]; // header row

  // Each card is a li in the image list
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Get the card image element
    const img = li.querySelector('img');
    // Get the article block which contains all text
    const article = li.querySelector('.cmp-image-list__item-content');
    const textParts = [];

    if (article) {
      // Prefer the link-wrapped title, fallback to plain span
      let titleLink = article.querySelector('.cmp-image-list__item-title-link');
      let titleSpan = article.querySelector('.cmp-image-list__item-title');
      if (titleLink) {
        textParts.push(titleLink);
      } else if (titleSpan) {
        textParts.push(titleSpan);
      }
      // Description, if present
      let descr = article.querySelector('.cmp-image-list__item-description');
      if (descr) {
        // Add a line break between title and description, only if both exist
        if (titleLink || titleSpan) textParts.push(document.createElement('br'));
        textParts.push(descr);
      }
    }

    // Add row; reference existing elements, not clones
    cells.push([
      img || '', // first cell: the image element or empty if not found
      textParts.length ? textParts : '' // second cell: array of elements or empty
    ]);
  });

  // Build block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
