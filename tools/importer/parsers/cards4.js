/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' title element
  const allTitles = element.querySelectorAll('.cmp-title__text');
  let allArticlesTitleEl = null;
  for (const t of allTitles) {
    if (t.textContent.trim().toLowerCase() === 'all articles') {
      allArticlesTitleEl = t;
      break;
    }
  }
  if (!allArticlesTitleEl) return;

  // Find the image-list immediately after 'All Articles' title
  let imageListEl = null;
  let scan = allArticlesTitleEl.closest('.cmp-title').parentElement.nextElementSibling;
  while (scan) {
    const list = scan.querySelector && scan.querySelector('.cmp-image-list');
    if (list) {
      imageListEl = list;
      break;
    }
    scan = scan.nextElementSibling;
  }
  if (!imageListEl) return;

  // Compose cards rows
  const rows = [['Cards (cards4)']];
  imageListEl.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // First cell: image
    let img = li.querySelector('img');
    // Second cell: text content (title + description)
    let textWrap = document.createElement('div');

    // Title (if present)
    let titleEl = li.querySelector('.cmp-image-list__item-title');
    if (titleEl) {
      let strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      let strongDiv = document.createElement('div');
      strongDiv.appendChild(strong);
      textWrap.appendChild(strongDiv);
    }

    // Description (if present)
    let descEl = li.querySelector('.cmp-image-list__item-description');
    if (descEl) {
      let descDiv = document.createElement('div');
      descDiv.textContent = descEl.textContent.trim();
      textWrap.appendChild(descDiv);
    }

    // Compose row
    rows.push([
      img ? img : '',
      textWrap
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original image-list section with the new table
  imageListEl.parentElement.replaceWith(table);
}
