/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' section
  let allArticlesTitle = Array.from(element.querySelectorAll('.cmp-title__text'))
    .find(t => t.textContent.trim().toLowerCase() === 'all articles');
  if (!allArticlesTitle) return;
  // The .aem-GridColumn for the title
  let allArticlesGridCol = allArticlesTitle.closest('.aem-GridColumn');
  if (!allArticlesGridCol) return;
  // Find the next sibling .image-list block
  let imageList = allArticlesGridCol.nextElementSibling;
  while (imageList && !imageList.classList.contains('image-list')) {
    imageList = imageList.nextElementSibling;
  }
  if (!imageList) return;
  // Find all li.cmp-image-list__item
  const cardEls = Array.from(imageList.querySelectorAll('li.cmp-image-list__item'));
  if (!cardEls.length) return;
  const rows = [];
  // Header row as in the example
  rows.push(['Cards (cards4)']);
  cardEls.forEach(li => {
    // Image: find the existing <img> element
    const img = li.querySelector('.cmp-image__image');
    // Compose text content: title (h3), description (p), link (a)
    const frag = document.createDocumentFragment();
    // Title: use as h3
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      frag.appendChild(h3);
    }
    // Description (if present)
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      frag.appendChild(p);
    }
    // Link (optional, use title-link href/text if present)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleLink.textContent;
      frag.appendChild(a);
    }
    rows.push([img, frag]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageList.replaceWith(table);
}
