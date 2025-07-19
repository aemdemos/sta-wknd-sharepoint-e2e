/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cards block (image-list)
  const cardsBlock = element.querySelector('.image-list.list, .cmp-image-list');
  if (!cardsBlock) return;

  // Find all the cards (li items)
  const ul = cardsBlock.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const lis = Array.from(ul.children);

  // Header row exactly as in the example
  const cells = [['Cards (cards4)']];

  lis.forEach((li) => {
    // IMAGE CELL: first <img> inside the list item
    const img = li.querySelector('img');

    // TEXT CELL: preserve heading level, link structure, and plain text
    const article = li.querySelector('article');
    let textCell = [];
    if (article) {
      // Get the title/link
      const titleLink = article.querySelector('.cmp-image-list__item-title-link');
      const titleText = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
      if (titleText) {
        const heading = document.createElement('strong'); // Use <strong> to match bolded heading in example
        heading.textContent = titleText.textContent.trim();
        if (titleLink.href) {
          const a = document.createElement('a');
          a.href = titleLink.href;
          a.appendChild(heading);
          textCell.push(a);
        } else {
          textCell.push(heading);
        }
      }
      // Get the description - all text in .cmp-image-list__item-description
      const desc = article.querySelector('.cmp-image-list__item-description');
      if (desc && desc.textContent.trim()) {
        // If there is a heading above, add a <br> to match linebreak in example
        if (textCell.length > 0) textCell.push(document.createElement('br'));
        textCell.push(desc.textContent.trim());
      }
    }
    // Only add the row if there is either an image or text
    if (img || textCell.length > 0) {
      cells.push([
        img,
        textCell.length === 1 ? textCell[0] : textCell
      ]);
    }
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
