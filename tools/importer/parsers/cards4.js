/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' section title
  const titleEls = Array.from(element.querySelectorAll('h2.cmp-title__text'));
  const allArticlesTitle = titleEls.find(h2 => h2.textContent.trim().toLowerCase() === 'all articles');
  if (!allArticlesTitle) return;
  // Find the image-list block associated with 'All Articles'
  let imageListDiv = allArticlesTitle.closest('.cmp-title').parentElement.nextElementSibling;
  if (!imageListDiv || !imageListDiv.classList.contains('image-list')) return;
  const ul = imageListDiv.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = Array.from(ul.querySelectorAll('li.cmp-image-list__item'));
  const rows = items.map(item => {
    // First cell: image element (reference)
    const img = item.querySelector('img');
    // Second cell: title (strong), then description
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const title = titleLink && titleLink.querySelector('.cmp-image-list__item-title');
    const desc = item.querySelector('.cmp-image-list__item-description');
    const textCell = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.push(strong);
      // Only add <br> if there's also a description
      if (desc && desc.textContent.trim()) {
        textCell.push(document.createElement('br'));
      }
    }
    if (desc && desc.textContent.trim()) {
      // Use an inline span for description
      const span = document.createElement('span');
      span.textContent = desc.textContent.trim();
      textCell.push(span);
    }
    return [img, textCell];
  });
  const tableCells = [
    ['Cards (cards4)'],
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  imageListDiv.replaceWith(table);
}
