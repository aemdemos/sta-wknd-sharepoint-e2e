/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  const list = element.querySelector('ul.cmp-image-list');
  if (list) {
    const items = list.querySelectorAll(':scope > li.cmp-image-list__item');
    items.forEach((item) => {
      const content = item.querySelector(':scope > article.cmp-image-list__item-content');
      if (!content) return;

      // First cell: Image (reference the original <img>)
      let imageCell = null;
      const imageLink = content.querySelector('.cmp-image-list__item-image-link');
      if (imageLink) {
        const img = imageLink.querySelector('img');
        if (img) imageCell = img;
      }

      // Second cell: Text content
      const textCellContent = [];
      const titleLink = content.querySelector('.cmp-image-list__item-title-link');
      const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
      if (titleSpan && titleSpan.textContent.trim()) {
        // Render the card title in <strong>, optionally as a link if present
        const strong = document.createElement('strong');
        if (titleLink && titleLink.getAttribute('href')) {
          const a = document.createElement('a');
          a.href = titleLink.getAttribute('href');
          a.textContent = titleSpan.textContent.trim();
          strong.appendChild(a);
        } else {
          strong.textContent = titleSpan.textContent.trim();
        }
        textCellContent.push(strong);
      }
      const descSpan = content.querySelector('.cmp-image-list__item-description');
      if (descSpan && descSpan.textContent.trim()) {
        // Description right below the title
        const descDiv = document.createElement('div');
        descDiv.textContent = descSpan.textContent.trim();
        textCellContent.push(descDiv);
      }
      rows.push([
        imageCell,
        textCellContent.length === 1 ? textCellContent[0] : textCellContent
      ]);
    });
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
