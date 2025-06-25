/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to build the text content cell (title and description, with link if present)
  function buildTextCell(item) {
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    const contents = [];
    // Add title as <strong>, wrapped in <a> if there is a link
    if (titleSpan) {
      if (titleLink) {
        // Use the existing <a> tag but set its contents to <strong>title</strong>
        // Reference (not clone!)
        titleLink.innerHTML = '';
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        titleLink.appendChild(strong);
        contents.push(titleLink);
      } else {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        contents.push(strong);
      }
    }
    if (descSpan) {
      // Wrap in <p> for consistent spacing
      const para = document.createElement('p');
      para.textContent = descSpan.textContent;
      contents.push(para);
    }
    return contents;
  }

  const headerRow = ['Cards (cards21)'];
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const cards = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));
  const rows = cards.map((item) => {
    // Use the existing <img> element for the card image
    const img = item.querySelector('img');
    const textCell = buildTextCell(item);
    return [img, textCell];
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);
  element.replaceWith(table);
}
