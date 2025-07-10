/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards22)'];
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;
  const items = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));
  const rows = [headerRow];
  items.forEach((li) => {
    // Image (first column)
    let imageEl = null;
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imageEl = imgLink.querySelector('img');
    }
    // Text content (second column)
    const textContent = [];
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textContent.push(strong);
      }
    }
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Always add a <p> for the description to match semantic structure
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textContent.push(p);
    }
    rows.push([
      imageEl,
      textContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
