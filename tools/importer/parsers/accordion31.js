/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion31)'];
  const rows = [headerRow];

  // Find the main content area (article)
  const mainArticle = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!mainArticle) return;

  // Get the main title (h3) and author (h4), and the first intro content (before first h2)
  const titleEl = mainArticle.querySelector('h3.cmp-contentfragment__title, h1.cmp-title__text');
  const authorEl = element.querySelector('h4.cmp-title__text');

  // Get the content root
  const contentRoot = mainArticle.querySelector('.cmp-contentfragment__elements') || mainArticle;
  // Only keep element nodes
  const children = Array.from(contentRoot.children);

  // Find all h2s (section headers)
  const h2s = [];
  children.forEach((child, i) => {
    if (child.tagName.toLowerCase() === 'div') {
      const h2 = child.querySelector('h2.cmp-title__text');
      if (h2) {
        h2s.push({ el: h2, idx: i, wrapper: child });
      }
    }
  });

  // Find all h2 indices
  const h2Indices = h2s.map(h => children.indexOf(h.wrapper));

  // Find the intro content before the first h2
  let introEndIdx = h2Indices.length > 0 ? h2Indices[0] : children.length;
  const introContent = [];
  for (let i = 0; i < introEndIdx; i++) {
    const node = children[i];
    // Only push meaningful content
    if (
      node.tagName.toLowerCase() === 'p' ||
      node.querySelector('blockquote') ||
      node.querySelector('img') ||
      node.querySelector('.cmp-image') ||
      node.querySelector('.cmp-text')
    ) {
      introContent.push(node);
    }
  }
  const introTitle = titleEl ? titleEl.textContent.trim() : 'Introduction';
  const introCellContent = [];
  if (titleEl) introCellContent.push(titleEl);
  if (authorEl) introCellContent.push(authorEl);
  if (introTitle && introContent.length) {
    rows.push([
      introTitle,
      [...introCellContent, ...introContent]
    ]);
  }

  // Process each h2 section as an accordion item
  for (let h = 0; h < h2s.length; h++) {
    const { el: h2, wrapper } = h2s[h];
    const sectionTitle = h2.textContent.trim();
    const sectionContent = [];
    let startIdx = children.indexOf(wrapper) + 1;
    let endIdx = h + 1 < h2s.length ? children.indexOf(h2s[h + 1].wrapper) : children.length;
    for (let i = startIdx; i < endIdx; i++) {
      const node = children[i];
      if (
        node.tagName.toLowerCase() === 'p' ||
        node.querySelector('img') ||
        node.querySelector('blockquote') ||
        node.querySelector('.cmp-image') ||
        node.querySelector('.cmp-text')
      ) {
        sectionContent.push(node);
      }
    }
    if (sectionTitle && sectionContent.length) {
      rows.push([
        sectionTitle,
        sectionContent
      ]);
    }
  }

  // Build the block table
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
