/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion9) block: 2 columns, multiple rows, each row is [title, content]
  const headerRow = ['Accordion (accordion9)'];
  const rows = [headerRow];

  // Find the main content area (ignore sidebar)
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Helper to collect all nodes between two elements, including nested grids
  function collectContentBetween(startEl, endEl) {
    const content = [];
    let node = startEl.nextElementSibling;
    while (node && node !== endEl) {
      // Paragraphs and blockquotes
      if (node.matches('p, blockquote')) {
        content.push(node);
      }
      // Images
      if (node.querySelectorAll) {
        node.querySelectorAll('img').forEach(img => content.push(img));
      }
      // Nested blockquotes
      if (node.querySelectorAll) {
        node.querySelectorAll('blockquote').forEach(bq => {
          if (!content.includes(bq)) content.push(bq);
        });
      }
      // If node is a grid, search its children for paragraphs/images/quotes
      if (node.classList && node.classList.contains('aem-Grid')) {
        node.querySelectorAll('p, blockquote, img').forEach(el => {
          if (!content.includes(el)) content.push(el);
        });
      }
      node = node.nextElementSibling;
    }
    return content;
  }

  // First accordion item: main title and intro content before first section
  const mainTitle = contentFragment.querySelector('h3.cmp-contentfragment__title');
  const sectionTitles = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
  if (mainTitle && sectionTitles.length) {
    const introContent = collectContentBetween(mainTitle, sectionTitles[0]);
    if (introContent.length) {
      rows.push([mainTitle, introContent.length === 1 ? introContent[0] : introContent]);
    }
  }

  // For each section, find its title and content
  for (let i = 0; i < sectionTitles.length; i++) {
    const titleEl = sectionTitles[i];
    const nextTitle = sectionTitles[i + 1] || null;
    const contentEls = collectContentBetween(titleEl, nextTitle);
    if (contentEls.length) {
      rows.push([titleEl, contentEls.length === 1 ? contentEls[0] : contentEls]);
    }
  }

  // Add all narrative paragraphs and blockquotes not captured in sections
  // This will ensure all text content is included
  const allPsAndBqs = Array.from(contentFragment.querySelectorAll('p, blockquote'));
  const alreadyIncluded = new Set();
  rows.forEach(row => {
    if (Array.isArray(row[1])) {
      row[1].forEach(el => alreadyIncluded.add(el));
    } else if (row[1]) {
      alreadyIncluded.add(row[1]);
    }
  });
  allPsAndBqs.forEach(el => {
    if (!alreadyIncluded.has(el)) {
      // Add as a separate accordion item with a generic title
      rows.push([document.createTextNode('Additional Info'), el]);
    }
  });

  // Add author byline as last accordion item if present
  const byline = element.querySelector('.cmp-byline');
  if (byline) {
    const authorName = byline.querySelector('.cmp-byline__name');
    const authorOcc = byline.querySelector('.cmp-byline__occupations');
    const authorImg = byline.querySelector('img');
    const authorContent = [];
    if (authorImg) authorContent.push(authorImg);
    if (authorName) authorContent.push(authorName);
    if (authorOcc) authorContent.push(authorOcc);
    rows.push([
      document.createTextNode('About the Author'),
      authorContent.length === 1 ? authorContent[0] : authorContent
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
