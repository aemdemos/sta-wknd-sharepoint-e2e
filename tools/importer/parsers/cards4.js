/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block containing cards
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;
  const ul = imageList.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = Array.from(ul.children).filter(li => li.matches('.cmp-image-list__item'));

  // Table header matches example EXACTLY
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // First cell: reference the existing <img> element
    const img = item.querySelector('img');

    // Second cell: reference and structure all text content
    const textFragments = [];
    // Title as <strong>
    const titleSpan = item.querySelector('a.cmp-image-list__item-title-link .cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textFragments.push(strong);
    }
    // Add description, separated by line breaks
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      if (textFragments.length > 0) {
        textFragments.push(document.createElement('br'));
        textFragments.push(document.createElement('br'));
      }
      textFragments.push(descSpan);
    }
    // Append row only if image and some text exists
    if (img && textFragments.length > 0) {
      rows.push([img, textFragments]);
    }
  });

  // Create block and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
