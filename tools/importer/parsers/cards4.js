/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' section title block
  const allTitles = Array.from(element.querySelectorAll('.cmp-title'));
  const allArticlesTitle = allTitles.find(title => {
    const h2 = title.querySelector('h2');
    return h2 && h2.textContent.trim().toLowerCase() === 'all articles';
  });
  if (!allArticlesTitle) return;

  // Find the image-list block after the 'All Articles' section
  let imageList = null;
  let curr = allArticlesTitle.parentElement;
  while (curr && curr.nextElementSibling) {
    curr = curr.nextElementSibling;
    if (curr.classList.contains('image-list')) {
      imageList = curr;
      break;
    }
  }
  if (!imageList) return;

  const ul = imageList.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  if (!items.length) return;

  // Build the table header and card rows
  const rows = [['Cards (cards4)']];

  items.forEach(item => {
    // Image
    let imgEl = null;
    const article = item.querySelector('article.cmp-image-list__item-content');
    const imgLink = article && article.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      const cmpImgDiv = imgLink.querySelector('.cmp-image');
      if (cmpImgDiv) {
        imgEl = cmpImgDiv.querySelector('img');
      }
    }
    if (!imgEl) {
      imgEl = article && article.querySelector('img');
    }

    // Text content
    let textParts = [];
    // Title as <strong>
    const titleLink = article && article.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = article && article.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textParts.push(strong);
    }
    // Description
    const desc = article && article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      if (textParts.length) {
        textParts.push(document.createElement('br'));
      }
      textParts.push(document.createTextNode(desc.textContent.trim()));
    }
    // CTA (only if link is present and not just a decorative span)
    if (titleLink && titleLink.href) {
      textParts.push(document.createElement('br'));
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.textContent = 'Read More';
      textParts.push(link);
    }
    // Compose the row
    rows.push([imgEl, textParts]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageList.replaceWith(table);
}
