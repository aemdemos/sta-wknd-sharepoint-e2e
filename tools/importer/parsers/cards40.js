/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: use block name as in example
  const headerRow = ['Cards (cards40)'];

  // Find the list of card items
  const imageList = element.querySelector('ul.cmp-image-list');
  const items = imageList ? imageList.querySelectorAll('li.cmp-image-list__item') : [];

  const rows = Array.from(items).map(item => {
    // Extract the image element (reference existing <img>)
    let imgEl = null;
    const imgLink = item.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      const imgContainer = imgLink.querySelector('.cmp-image-list__item-image');
      if (imgContainer) {
        imgEl = imgContainer.querySelector('img');
      }
    }

    // Extract the title (as <strong>)
    let titleNode = null;
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan && titleSpan.textContent.trim()) {
      titleNode = document.createElement('strong');
      titleNode.textContent = titleSpan.textContent.trim();
    }

    // Extract the description
    let descriptionText = '';
    const descriptionSpan = item.querySelector('.cmp-image-list__item-description');
    if (descriptionSpan && descriptionSpan.textContent.trim()) {
      descriptionText = descriptionSpan.textContent.trim();
    }

    // Compose text cell: title (strong) then description (plain text)
    const textCell = [];
    if (titleNode) {
      textCell.push(titleNode);
    }
    if (descriptionText) {
      // Add a <br> if there is both title and description
      if (titleNode) {
        textCell.push(document.createElement('br'));
      }
      textCell.push(document.createTextNode(descriptionText));
    }
    // Defensive: If no title nor description, show nothing
    return [imgEl, textCell.length ? textCell : ''];
  });

  // Compose the table rows
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
