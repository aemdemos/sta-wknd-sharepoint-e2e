/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must have same number of columns as data rows (2 columns)
  const headerRow = ['Cards (cards26)', ''];
  const cells = [headerRow];

  // Find the cards container
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // IMAGE CELL
    let imageContainer = article.querySelector('.cmp-image-list__item-image');
    let imageCell = null;
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        imageCell = imageContainer;
      }
    }

    // TEXT CELL
    let titleSpan = article.querySelector('.cmp-image-list__item-title');
    let descSpan = article.querySelector('.cmp-image-list__item-description');

    const textCell = document.createElement('div');
    if (titleSpan && titleSpan.textContent) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCell.appendChild(strong);
    }
    if (descSpan && descSpan.textContent) {
      if (titleSpan && titleSpan.textContent) {
        textCell.appendChild(document.createElement('br'));
      }
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent;
      textCell.appendChild(descDiv);
    }

    cells.push([imageCell, textCell]);
  });

  // Generate and replace block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
