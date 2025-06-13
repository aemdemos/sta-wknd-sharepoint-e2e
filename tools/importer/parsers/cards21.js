/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Cards (cards21)'];

  // 2. Locate the image list
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // 3. Iterate through cards
  const rows = [headerRow];
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach(li => {
    // IMAGE: Find the <img> element inside the image link
    let imageEl = null;
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imageEl = imgLink.querySelector('img');
    }

    // TEXT: Title as <strong>, Description as <p>, preserving order and only if exists
    const textContent = [];
    // Title as <strong>
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleText = titleLink.textContent.trim();
      if (titleText) {
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        textContent.push(strong);
      }
    }
    // Description as <p>
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descText = descSpan.textContent.trim();
      if (descText) {
        const p = document.createElement('p');
        p.textContent = descText;
        textContent.push(p);
      }
    }
    // If nothing exists, fallback to empty string
    const textCell = textContent.length ? (textContent.length === 1 ? textContent[0] : textContent) : '';
    // Compose the row
    rows.push([imageEl, textCell]);
  });

  // 4. Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
