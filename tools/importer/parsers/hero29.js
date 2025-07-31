/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name as in example, in a single-cell row
  const headerRow = ['Hero (hero29)'];

  // 2. Background image row: Top hero image (first .image img)
  let heroImg = null;
  // Find the first .image img inside the element (most likely the hero image)
  const heroImageDiv = element.querySelector('.image');
  if (heroImageDiv) {
    const heroImgCandidate = heroImageDiv.querySelector('img');
    if (heroImgCandidate) {
      heroImg = heroImgCandidate;
    }
  }
  // fallback: just the first img in the element
  if (!heroImg) {
    heroImg = element.querySelector('img');
  }
  const imageRow = [heroImg ? heroImg : ''];

  // 3. Content row: Headline, subheadline, and intro text
  // Grab all heading and paragraph elements at the top of the main content column
  // Find the main 8-column container (not the sidebar)
  let mainContent = null;
  const allMains = element.querySelectorAll('main.container');
  for (const m of allMains) {
    // Find the one with a .cmp-container that includes both .title and .contentfragment
    if (
      m.querySelector('.cmp-container .title h1') &&
      m.querySelector('.cmp-container article.contentfragment, .cmp-container .cmp-contentfragment')
    ) {
      mainContent = m;
      break;
    }
  }
  if (!mainContent) mainContent = element; // fallback, use root

  // Title (h1)
  const h1 = mainContent.querySelector('.title h1');
  // Subheading (h4, typically author)
  const h4 = mainContent.querySelector('.title h4');
  // First meaningful paragraph in article/contentfragment
  let leadPara = null;
  const mainArticle = mainContent.querySelector('article.contentfragment, .cmp-contentfragment, article');
  if (mainArticle) {
    const firstP = mainArticle.querySelector('p');
    if (firstP && firstP.textContent.trim().length > 0) {
      leadPara = firstP;
    }
  }
  // fallback: find first <p>
  if (!leadPara) {
    const para = mainContent.querySelector('p');
    if (para && para.textContent.trim().length > 0) {
      leadPara = para;
    }
  }
  // Compose the content row in order (h1, h4, first p)
  const contentRowElements = [];
  if (h1) contentRowElements.push(h1);
  if (h4) contentRowElements.push(h4);
  if (leadPara) contentRowElements.push(leadPara);
  // If nothing found, don't leave empty
  const contentRow = [contentRowElements.length ? contentRowElements : ''];

  // Compose the table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
