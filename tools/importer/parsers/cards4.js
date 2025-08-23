/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list root (the 'cards') within the provided element
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // The table header must match the example exactly
  const headerRow = ['Cards (cards4)'];
  const rows = [];

  // For each card <li> in the list
  imageList.querySelectorAll(':scope > li').forEach((li) => {
    // First cell: image element (reference, not clone)
    const img = li.querySelector('img');

    // Second cell: text content (title and description)
    const textCell = [];
    // Extract the title (as strong, linked if possible)
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const strong = document.createElement('strong');
      const titleLink = titleSpan.closest('a');
      if (titleLink) {
        strong.appendChild(titleLink.cloneNode(true));
        strong.querySelector('a').textContent = titleSpan.textContent;
      } else {
        strong.textContent = titleSpan.textContent;
      }
      textCell.push(strong);
    }
    // Extract the description (always present, reference instead of clone if possible)
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Use reference if not included above
      textCell.push(descSpan);
    }

    // Edge case: If anything else in the article should be included, such as extra text
    // (Not necessary for this block, but if there are extra elements with text, include them)
    const article = li.querySelector('article');
    if (article) {
      Array.from(article.childNodes).forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          !node.classList.contains('cmp-image-list__item-image-link') &&
          !node.classList.contains('cmp-image-list__item-title-link') &&
          !node.classList.contains('cmp-image-list__item-title') &&
          !node.classList.contains('cmp-image-list__item-description')
        ) {
          if (node.textContent && node.textContent.trim() !== '') {
            // Only include if not already present
            let alreadyPresent = textCell.some(
              (el) => el.textContent && el.textContent.trim() === node.textContent.trim()
            );
            if (!alreadyPresent) textCell.push(node);
          }
        }
      });
    }

    // Push the row only if image and at least some text content exist
    if (img && textCell.length) {
      rows.push([img, textCell]);
    }
  });

  // Compose the table and replace the block
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
