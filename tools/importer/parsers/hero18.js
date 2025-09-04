/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image (should be the first .image block in the main > div > div)
  let heroImage = null;
  const mainImageDiv = element.querySelector('.image');
  if (mainImageDiv) {
    heroImage = mainImageDiv.querySelector('img');
  }

  // Find the main title (h1)
  let heroTitle = null;
  const h1 = element.querySelector('h1');
  if (h1) {
    heroTitle = h1.cloneNode(true);
  }

  // Find the author/byline (h4 or .cmp-title__text in a .title block after h1)
  let heroByline = null;
  const h4 = element.querySelector('h4');
  if (h4) {
    heroByline = h4.cloneNode(true);
  }

  // Find ALL paragraphs before the first <article class="contentfragment">
  let heroParas = [];
  const contentFragment = element.querySelector('article.contentfragment');
  if (contentFragment) {
    let node = h1 ? h1.parentElement : element.firstElementChild;
    while (node && node !== contentFragment) {
      // collect all <p> in this node
      const ps = node.querySelectorAll ? node.querySelectorAll('p') : [];
      ps.forEach(p => {
        heroParas.push(p.cloneNode(true));
      });
      node = node.nextElementSibling;
    }
  }
  // fallback: if nothing found, just get the first <p>
  if (heroParas.length === 0) {
    const p = element.querySelector('p');
    if (p) heroParas.push(p.cloneNode(true));
  }

  // Compose the content cell: title, byline, all intro paragraphs (if present)
  const contentCell = [];
  if (heroTitle) contentCell.push(heroTitle);
  if (heroByline) contentCell.push(heroByline);
  heroParas.forEach(p => contentCell.push(p));

  // Table rows: header, image, content
  const headerRow = ['Hero (hero18)'];
  const imageRow = [heroImage ? heroImage.cloneNode(true) : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
