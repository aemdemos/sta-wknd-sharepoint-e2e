/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards21)'];

  // Find the UL containing cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Build rows for each card
  const rows = Array.from(ul.children)
    .filter(li => li.classList.contains('cmp-image-list__item'))
    .map(li => {
      // Find image: within article > a.cmp-image-list__item-image-link > div > div.cmp-image > img
      const imgLink = li.querySelector('.cmp-image-list__item-image-link');
      let imgElem = null;
      if (imgLink) {
        const imageDiv = imgLink.querySelector('.cmp-image');
        if (imageDiv) {
          imgElem = imageDiv.querySelector('img');
        }
      }

      // Find title: .cmp-image-list__item-title within .cmp-image-list__item-title-link
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      let titleElem = null;
      if (titleLink) {
        titleElem = titleLink.querySelector('.cmp-image-list__item-title');
      }

      // Find description: .cmp-image-list__item-description
      const descElem = li.querySelector('.cmp-image-list__item-description');

      // Compose the text column: title (strong), then description
      const textElems = [];
      if (titleElem) {
        // Title as strong
        const strong = document.createElement('strong');
        strong.textContent = titleElem.textContent;
        textElems.push(strong);
      }
      if (descElem) {
        // Add a <br> if we have both title and description
        if (titleElem) {
          textElems.push(document.createElement('br'));
        }
        textElems.push(descElem);
      }

      // If only description is present, return that alone
      return [imgElem, textElems.length ? textElems : null];
    });

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
