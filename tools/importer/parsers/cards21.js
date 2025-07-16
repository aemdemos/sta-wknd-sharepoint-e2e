/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image list (cards container)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  // Table header row: must exactly match required block name
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Get the card content article
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // 1st cell: The image
    let image = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Reference the <img> inside the link (do not clone)
      const img = imageLink.querySelector('img');
      if (img) image = img;
    }

    // 2nd cell: Text (title as strong, then description)
    const textCell = [];
    // Title as <strong>
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textCell.push(strong);
      }
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      textCell.push(document.createElement('br'));
      textCell.push(desc);
    }

    rows.push([
      image,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
