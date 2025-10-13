/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block: 2 columns, multiple rows, each row = card (image | text)
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find the card container
  // Use less specific selector to ensure all cards are found
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  
  // For each card (li)
  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image (first column): find the <img> inside the image link
    let imageEl = null;
    const img = article.querySelector('img');
    if (img) imageEl = img;

    // Text (second column): title (as heading), description, optional CTA
    const textContent = document.createElement('div');
    // Title
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      // If title is a link, wrap with <a>
      if (titleLink && titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.textContent = h3.textContent;
        h3.textContent = '';
        h3.appendChild(a);
      }
      textContent.appendChild(h3);
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textContent.appendChild(p);
    }
    // No extra CTA needed (title is the link)

    rows.push([
      imageEl,
      textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
