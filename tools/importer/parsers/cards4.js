/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Locate the 'All Articles' section by finding the h2 with text 'All Articles'
  const allArticlesTitle = Array.from(element.querySelectorAll('.cmp-title__text')).find(h => h.textContent.trim().toLowerCase() === 'all articles');
  if (!allArticlesTitle) return;
  // 2. The image-list div is after the All Articles title
  let curr = allArticlesTitle.closest('.cmp-title').parentElement;
  // Find the next sibling containing the image list (should be div.image-list)
  let imageListDiv = curr.nextElementSibling;
  while (imageListDiv && !imageListDiv.classList.contains('image-list')) {
    imageListDiv = imageListDiv.nextElementSibling;
  }
  if (!imageListDiv) return;
  const ul = imageListDiv.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // 3. For each card (li), extract image and text content as per spec
  const cards = Array.from(ul.children).map(li => {
    const article = li.querySelector('article');
    // Image: first .cmp-image (img element) inside article
    let image = null;
    const imgDiv = article && article.querySelector('.cmp-image-list__item-image .cmp-image');
    if (imgDiv) {
      image = imgDiv.querySelector('img');
    }
    // Title: .cmp-image-list__item-title (as <strong>, per example style)
    let titleElem = null;
    const titleSpan = article && article.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      titleElem = document.createElement('strong');
      titleElem.textContent = titleSpan.textContent.trim();
    }
    // Description:
    const descElem = article && article.querySelector('.cmp-image-list__item-description');
    // Compose text cell: Title (<strong>), <br> if desc, description span
    const textCellContent = [];
    if (titleElem) textCellContent.push(titleElem);
    if (descElem && descElem.textContent.trim()) {
      if (titleElem) textCellContent.push(document.createElement('br'));
      textCellContent.push(descElem);
    }
    return [image, textCellContent];
  });

  // 4. Compose table rows
  const rows = [
    ['Cards (cards4)'],
    ...cards
  ];
  // 5. Create and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageListDiv.replaceWith(table);
}
