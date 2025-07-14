/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' title h2
  const titles = Array.from(element.querySelectorAll('.cmp-title__text'));
  const allArticlesTitle = titles.find(t => t.textContent.trim().toLowerCase() === 'all articles');
  if (!allArticlesTitle) return;
  // The .cmp-title wrapper div
  const allArticlesTitleWrapper = allArticlesTitle.closest('.cmp-title');
  // The next sibling after the title wrapper should be the list
  let imageListBlock = allArticlesTitleWrapper.parentElement.nextElementSibling;
  // Defensive: ensure this really is the image-list
  if (!imageListBlock || !imageListBlock.querySelector('ul.cmp-image-list')) return;
  const cards = Array.from(imageListBlock.querySelectorAll('li.cmp-image-list__item'));
  const rows = [['Cards (cards2)']];
  cards.forEach(card => {
    // Get the image
    const imgDiv = card.querySelector('.cmp-image-list__item-image .cmp-image');
    let imgEl = null;
    if (imgDiv) {
      imgEl = imgDiv.querySelector('img');
    }
    // Get the text block: title, description
    const content = card.querySelector('article.cmp-image-list__item-content');
    const frag = document.createElement('div');
    // Title as heading (keep as h3 for block semantics)
    const titleLink = content.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Reference the actual <a> inside the heading
      const h = document.createElement('h3');
      h.appendChild(titleLink);
      frag.appendChild(h);
    }
    // Description
    const desc = content.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      frag.appendChild(p);
    }
    // No explicit CTA in this block (handled by title link)
    rows.push([
      imgEl,
      frag
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageListBlock.replaceWith(table);
}
