/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' section by locating the h2 with text 'All Articles'
  const allArticlesTitle = Array.from(element.querySelectorAll('h2.cmp-title__text'))
    .find(h2 => h2.textContent.trim().toLowerCase() === 'all articles');
  if (!allArticlesTitle) return;

  // The .image-list follows the 'All Articles' h2 (find its col, then next sibling)
  let imageListDiv = allArticlesTitle.closest('.aem-GridColumn');
  let current = imageListDiv.nextElementSibling;
  while (current && !current.classList.contains('image-list')) {
    current = current.nextElementSibling;
  }
  if (!current) return;
  const imageList = current;

  // Get all cards (li.cmp-image-list__item)
  const cardItems = imageList.querySelectorAll('li.cmp-image-list__item');
  const rows = [['Cards (cards4)']];

  cardItems.forEach(li => {
    // Image (first cell)
    const img = li.querySelector('img');
    let imageCell = img || '';
    // Title (linked, with text in <strong>)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    let titleFragment = '';
    if (titleLink && titleSpan) {
      // Use the existing link, but wrap its contents in <strong>
      // Move the title span out of the link and into <strong>
      const strong = document.createElement('strong');
      strong.appendChild(titleSpan);
      titleLink.innerHTML = '';
      titleLink.appendChild(strong);
      titleFragment = titleLink;
    } else if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      titleFragment = strong;
    }
    // Description (next line, plain text)
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descNode = '';
    if (descSpan && descSpan.textContent.trim()) {
      descNode = document.createTextNode(descSpan.textContent.trim());
    }
    // Compose text cell (title + description)
    let textCell;
    if (titleFragment && descNode) {
      const div = document.createElement('div');
      div.appendChild(titleFragment);
      div.appendChild(document.createElement('br'));
      div.appendChild(descNode);
      textCell = div;
    } else if (titleFragment) {
      textCell = titleFragment;
    } else if (descNode) {
      textCell = descNode;
    } else {
      textCell = '';
    }
    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageList.parentNode.replaceChild(table, imageList);
}
