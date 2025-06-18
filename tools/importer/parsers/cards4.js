/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the 'All Articles' title
  const allTitles = Array.from(element.querySelectorAll('.cmp-title__text'));
  const allArticlesTitle = allTitles.find(h => h.textContent.trim().toLowerCase() === 'all articles');
  if (!allArticlesTitle) return;

  // 2. Find the image-list block immediately following 'All Articles'
  let imageList = null;
  let parent = allArticlesTitle.closest('.cmp-title');
  if (parent) {
    let current = parent.parentElement.nextElementSibling;
    while (current) {
      if (current.classList && current.classList.contains('image-list')) {
        imageList = current;
        break;
      }
      current = current.nextElementSibling;
    }
  }
  if (!imageList) return;

  // 3. Get all 'li' cards inside the image-list
  const cardLis = imageList.querySelectorAll('li.cmp-image-list__item');
  const rows = [ ['Cards (cards4)'] ];

  cardLis.forEach(cardLi => {
    // Get image cell (the containing div to preserve structure/metadata)
    let imgDiv = cardLi.querySelector('.cmp-image-list__item-image');
    let imgCell = imgDiv || '';

    // Get text cell (title, description, link as text only)
    const titleLink = cardLi.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = cardLi.querySelector('.cmp-image-list__item-title');
    const descSpan = cardLi.querySelector('.cmp-image-list__item-description');

    const textFrag = document.createDocumentFragment();
    if (titleSpan) {
      // Use <strong> for title, to match the example card heading style
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textFrag.appendChild(strong);
    }
    if (descSpan) {
      // Add a <br> between title and description if both present
      if (titleSpan) textFrag.appendChild(document.createElement('br'));
      const desc = document.createElement('span');
      desc.textContent = descSpan.textContent.trim();
      textFrag.appendChild(desc);
    }
    // Do NOT add a "Read More" link unless it's explicitly in the source (example doesn't show it)

    rows.push([imgCell, textFrag]);
  });

  // 4. Replace the image list with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageList.replaceWith(table);
}
