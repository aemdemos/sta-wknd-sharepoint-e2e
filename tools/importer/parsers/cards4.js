/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Locate the 'All Articles' title to find the relevant card block
  const allTitles = Array.from(element.querySelectorAll('.cmp-title__text'));
  const allArticlesTitle = allTitles.find(
    (el) => el.textContent.trim().toLowerCase() === 'all articles'
  );
  if (!allArticlesTitle) return;

  // 2. The list is in the next sibling .image-list after the All Articles title's container
  let titleColumn = allArticlesTitle.closest('.aem-GridColumn');
  let imageListDiv = titleColumn && titleColumn.nextElementSibling;
  while (imageListDiv && !imageListDiv.classList.contains('image-list')) {
    imageListDiv = imageListDiv.nextElementSibling;
  }
  if (!imageListDiv) return;

  const ul = imageListDiv.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // 3. Extract card data
  const cards = [];
  const items = Array.from(ul.querySelectorAll('li.cmp-image-list__item'));
  items.forEach((li) => {
    // First cell: image (existing <img> element)
    const img = li.querySelector('img');

    // Second cell: text content (title as heading, description, link if any)
    const textFragments = [];
    // Title (use strong or heading analog for markdown bold)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for bold, separated from description by <br>
      const strong = document.createElement('strong');
      strong.textContent = titleLink.textContent.trim();
      textFragments.push(strong);
      textFragments.push(document.createElement('br'));
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      textFragments.push(document.createTextNode(desc.textContent.trim()));
    }
    cards.push([img, textFragments]);
  });

  // 4. Compose the table: header + each card row
  const tableRows = [
    ['Cards (cards4)'],
    ...cards,
  ];

  // 5. Replace the .image-list element with the new table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  imageListDiv.replaceWith(block);
}
