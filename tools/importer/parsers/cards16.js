/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match block name exactly
  const headerRow = ['Cards (cards16)'];
  const cards = [];
  // Handle empty element case
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  if (items.length === 0) {
    const block = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(block);
    return;
  }
  items.forEach((item) => {
    // Get image element: must be an <img>, not a link
    const imgDiv = item.querySelector('.cmp-image-list__item-image');
    let imgEl = imgDiv ? imgDiv.querySelector('img') : null;
    // Compose text content
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    const textCell = [];
    // Title: styled as heading (strong)
    if (titleLink && titleSpan) {
      // Wrap title text in <strong> and wrap with a link if available
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      if (titleLink.href) {
        const linkEl = document.createElement('a');
        linkEl.href = titleLink.href;
        linkEl.appendChild(strong);
        textCell.push(linkEl);
      } else {
        textCell.push(strong);
      }
    }
    // Description below heading
    if (descSpan && descSpan.textContent.trim()) {
      // Add <br> only if there's a title
      if (textCell.length > 0) {
        textCell.push(document.createElement('br'));
      }
      textCell.push(descSpan);
    }
    // If both image and text content are missing, skip this row
    if (!imgEl && textCell.length === 0) return;
    cards.push([imgEl, textCell]);
  });
  const cells = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
