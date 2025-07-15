/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the image list block
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;
  const cards = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));
  if (!cards.length) return;
  const rows = [['Cards (cards4)']];
  cards.forEach(card => {
    const article = card.querySelector('article.cmp-image-list__item-content');
    // Reference the image wrapper div, which contains image and meta
    let imageCell = null;
    const imgDiv = article.querySelector('.cmp-image-list__item-image');
    if (imgDiv) {
      imageCell = imgDiv;
    } else {
      imageCell = article.querySelector('img') || '';
    }
    // Build a container for all text content to ensure all text is included
    const textCell = document.createElement('div');
    // Title (should be first, as h3)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const h3 = document.createElement('h3');
      while (titleLink.firstChild) {
        h3.appendChild(titleLink.firstChild);
      }
      textCell.appendChild(h3);
    }
    // Description (may be missing)
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Wrap in a p for semantic markup
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCell.appendChild(p);
    }
    // Edge case: If there is additional text content (not in the above), include all non-empty, visible text
    const extra = Array.from(article.childNodes).filter(node => {
      // not already moved into textCell
      return (
        node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );
    });
    extra.forEach(node => {
      const span = document.createElement('span');
      span.textContent = node.textContent;
      textCell.appendChild(span);
    });
    rows.push([imageCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
