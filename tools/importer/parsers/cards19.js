/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards19) block parsing
  // Find the parent container for all cards
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;
  const ul = imageList.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Get all card items
  const items = Array.from(ul.querySelectorAll('li.cmp-image-list__item'));
  if (!items.length) return;

  // Table header
  const headerRow = ['Cards (cards19)'];
  const rows = [headerRow];

  // For each card, extract image and text content
  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the first image inside the card
    let imageEl = article.querySelector('.cmp-image-list__item-image img');
    if (!imageEl) imageEl = article.querySelector('img');

    // Text cell: title (as link if present), description
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    const descriptionSpan = article.querySelector('.cmp-image-list__item-description');

    const textCell = [];
    if (titleSpan && titleLink && titleLink.href) {
      // Title as a link, styled as heading
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleSpan.textContent;
      a.style.fontWeight = 'bold';
      textCell.push(a);
    } else if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCell.push(strong);
    }
    if (descriptionSpan) {
      const desc = document.createElement('p');
      desc.textContent = descriptionSpan.textContent;
      textCell.push(desc);
    }

    rows.push([
      imageEl ? imageEl : '',
      textCell
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
