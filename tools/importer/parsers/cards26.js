/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row for block table
  const table = [['Cards (cards26)']];

  // Select all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // IMAGE CELL: prefer the <img> inside its direct link, else the <img> itself, else blank
    let imageCellContent = '';
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imageCellContent = imgLink;
    } else {
      const img = item.querySelector('img');
      if (img) imageCellContent = img;
    }

    // TEXT CELL: title (as heading), description, optional CTA if present
    const textContent = [];

    // Title: <span class="cmp-image-list__item-title">, optionally inside a link
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleLink) {
      // Use the <a> but strip all children, add a <strong> for heading
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      // Remove all child nodes of link
      while (titleLink.firstChild) titleLink.removeChild(titleLink.firstChild);
      titleLink.appendChild(strong);
      textContent.push(titleLink);
    } else if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textContent.push(strong);
    }

    // Description: <span class="cmp-image-list__item-description">
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      textContent.push(descDiv);
    }

    table.push([
      imageCellContent,
      textContent
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}