/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find the image list (cards container)
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Iterate over each card (li)
  imageList.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Extract image (first column)
    let image = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) image = img;
    }

    // Extract title (as <strong> per example)
    let title = '';
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      }
    }

    // Extract description
    let desc = '';
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      desc = descSpan.textContent.trim();
    }

    // Compose text cell (second column)
    const textCell = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textCell.appendChild(strong);
      if (desc) {
        textCell.appendChild(document.createElement('br'));
      }
    }
    if (desc) {
      // Place description after the strong (no extra paragraph)
      textCell.append(desc);
    }

    rows.push([
      image,
      textCell
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
