/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: single cell only
  const cells = [['Cards (cards26)']];

  // Find <ul> containing cards
  const list = element.querySelector('ul');
  if (list) {
    const items = Array.from(list.children).filter((li) => li.tagName === 'LI');
    items.forEach((li) => {
      const article = li.querySelector('article');
      if (!article) return;
      // Image cell
      let imageEl = null;
      const imgLink = article.querySelector('.cmp-image-list__item-image-link');
      if (imgLink) {
        imageEl = imgLink.querySelector('img');
      } else {
        imageEl = article.querySelector('img');
      }
      // Text cell
      const textCell = [];
      const titleLink = article.querySelector('.cmp-image-list__item-title-link');
      const titleSpan = article.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        let titleElem;
        if (titleLink) {
          const strong = document.createElement('strong');
          const link = document.createElement('a');
          link.href = titleLink.getAttribute('href');
          link.textContent = titleSpan.textContent;
          strong.appendChild(link);
          titleElem = strong;
        } else {
          const strong = document.createElement('strong');
          strong.textContent = titleSpan.textContent;
          titleElem = strong;
        }
        textCell.push(titleElem);
      }
      const descSpan = article.querySelector('.cmp-image-list__item-description');
      if (descSpan) {
        textCell.push(descSpan);
      }
      cells.push([imageEl, textCell]);
    });
  }
  // The header row has only one cell, all others have two
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
