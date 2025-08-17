/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function for safe line breaks
  function addBr(arr) {
    if (arr.length > 0 && arr[arr.length - 1].nodeName !== 'BR') {
      arr.push(document.createElement('br'));
    }
  }

  // --- 1. Featured Article Card ---
  // Find the featured article teaser
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  let cards = [];
  if (featuredTeaser) {
    // Image (keep img reference, not clone)
    const image = featuredTeaser.querySelector('.cmp-teaser__image img');
    // Content
    const textCell = [];
    const pretitle = featuredTeaser.querySelector('.cmp-teaser__pretitle');
    const title = featuredTeaser.querySelector('.cmp-teaser__title');
    const desc = featuredTeaser.querySelector('.cmp-teaser__description');
    const cta = featuredTeaser.querySelector('.cmp-teaser__action-link');
    if (pretitle) {
      // Use a <span> for pretitle
      const span = document.createElement('span');
      span.textContent = pretitle.textContent.trim();
      textCell.push(span);
      addBr(textCell);
    }
    if (title) {
      // Use <strong> for title as per visual emphasis
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.push(strong);
      addBr(textCell);
    }
    if (desc) {
      // desc may contain HTML, append all children
      if (desc.children.length > 0) {
        Array.from(desc.childNodes).forEach((n) => textCell.push(n));
      } else {
        textCell.push(document.createTextNode(desc.textContent.trim()));
      }
      addBr(textCell);
    }
    if (cta) {
      textCell.push(cta);
    }
    cards.push([image, textCell]);
  }

  // --- 2. All Articles List Cards ---
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (imageList) {
    const items = imageList.querySelectorAll('.cmp-image-list__item');
    items.forEach(item => {
      // Image
      let img = item.querySelector('img');
      // Title (should be bold, use <strong>)
      const titleLink = item.querySelector('.cmp-image-list__item-title-link');
      let title = null;
      if (titleLink) {
        const span = titleLink.querySelector('.cmp-image-list__item-title');
        if (span) {
          title = document.createElement('strong');
          title.textContent = span.textContent.trim();
        }
      }
      // Description
      const desc = item.querySelector('.cmp-image-list__item-description');
      // Compose text cell
      const textCell = [];
      if (title) {
        textCell.push(title);
        if (desc && desc.textContent.trim()) textCell.push(document.createElement('br'));
      }
      if (desc && desc.textContent.trim()) {
        textCell.push(document.createTextNode(desc.textContent.trim()));
      }
      cards.push([img, textCell]);
    });
  }

  // Defensive: if no cards, do not replace
  if (cards.length === 0) return;

  // Compose full table: header + cards
  const cells = [
    ['Cards (cards4)'],
    ...cards
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
