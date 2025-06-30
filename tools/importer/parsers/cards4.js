/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' title to locate the card list
  const allArticlesH2 = Array.from(element.querySelectorAll('h2.cmp-title__text')).find(h2 => h2.textContent.trim().toLowerCase() === 'all articles');
  if (!allArticlesH2) return;
  const allArticlesTitleDiv = allArticlesH2.closest('.cmp-title');
  // The image-list block is the next sibling with class 'image-list'
  let imageListDiv = allArticlesTitleDiv.parentElement;
  while (imageListDiv && imageListDiv.nextElementSibling && !imageListDiv.nextElementSibling.classList.contains('image-list')) {
    imageListDiv = imageListDiv.nextElementSibling;
  }
  imageListDiv = imageListDiv && imageListDiv.nextElementSibling && imageListDiv.nextElementSibling.classList.contains('image-list') ? imageListDiv.nextElementSibling : null;
  if (!imageListDiv) return;
  const ul = imageListDiv.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  const rows = [['Cards (cards4)']];
  items.forEach(item => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;
    // --- Image (first column) ---
    let imgEl = null;
    const imgContainer = article.querySelector('.cmp-image-list__item-image .cmp-image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // --- Text content (second column) ---
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    let textCellContent = [];
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCellContent.push(strong);
    }
    if (descSpan) {
      if (titleSpan) textCellContent.push(document.createElement('br'));
      textCellContent.push(document.createTextNode(descSpan.textContent.trim()));
    }
    rows.push([imgEl || '', textCellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the image-list block in the DOM
  imageListDiv.replaceWith(table);
}