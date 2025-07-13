/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' .cmp-title__text with "All Articles" text
  const allTitles = element.querySelectorAll('.cmp-title__text');
  let allArticlesTitleDiv = null;
  for (const t of allTitles) {
    if (t.textContent.trim().toLowerCase() === 'all articles') {
      allArticlesTitleDiv = t.closest('.aem-GridColumn');
      break;
    }
  }
  if (!allArticlesTitleDiv) return;
  // Find its next sibling with class image-list
  let imageListDiv = allArticlesTitleDiv.nextElementSibling;
  while (imageListDiv && !imageListDiv.classList.contains('image-list')) {
    imageListDiv = imageListDiv.nextElementSibling;
  }
  if (!imageListDiv) return;
  const imageList = imageListDiv.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Build block table
  const cells = [];
  cells.push(['Cards (cards2)']);
  // Each li is a card
  imageList.querySelectorAll('li.cmp-image-list__item').forEach(li => {
    // Get image (first img inside li)
    const img = li.querySelector('img');
    // Text cell content
    const textCell = document.createElement('div');
    // Title (always present)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const titleDiv = document.createElement('div');
      titleDiv.style.fontWeight = 'bold';
      if (titleLink && titleLink.href) {
        // Use an <a> for the title if a link is present, else just text
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.textContent = titleSpan.textContent.trim();
        titleDiv.appendChild(a);
      } else {
        titleDiv.textContent = titleSpan.textContent.trim();
      }
      textCell.appendChild(titleDiv);
    }
    // Description (if present)
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textCell.appendChild(descDiv);
    }
    // Only add row if there is at least an image or text
    if (img || textCell.childNodes.length > 0) {
      cells.push([img, textCell]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
