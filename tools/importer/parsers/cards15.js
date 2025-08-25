/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we only process if the element contains the expected structure
  const headerRow = ['Cards (cards15)'];
  const rows = [];
  const list = element.querySelector('ul.cmp-image-list');
  if (list) {
    const items = list.querySelectorAll(':scope > li.cmp-image-list__item');
    items.forEach((li) => {
      const content = li.querySelector('article.cmp-image-list__item-content');
      // Image (first cell)
      let imageEl = null;
      const imageLink = content && content.querySelector('a.cmp-image-list__item-image-link');
      if (imageLink) {
        imageEl = imageLink.querySelector('img');
      }
      // Text (second cell): title (heading), description, link
      const textCell = [];
      // Title: Use strong to simulate heading, wrap in <a> for links
      const titleLink = content && content.querySelector('a.cmp-image-list__item-title-link');
      if (titleLink) {
        const span = titleLink.querySelector('.cmp-image-list__item-title');
        if (span) {
          const strong = document.createElement('strong');
          strong.textContent = span.textContent;
          if (titleLink.href && titleLink.href !== '#') {
            const a = document.createElement('a');
            a.href = titleLink.href;
            a.appendChild(strong);
            textCell.push(a);
          } else {
            textCell.push(strong);
          }
        }
      }
      // Description
      const desc = content && content.querySelector('.cmp-image-list__item-description');
      if (desc) {
        // Wrap in <div> for proper block display
        const descDiv = document.createElement('div');
        descDiv.textContent = desc.textContent;
        textCell.push(descDiv);
      }
      rows.push([
        imageEl,
        textCell
      ]);
    });
  }
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
