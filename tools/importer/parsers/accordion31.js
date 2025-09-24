/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cf) return;

  // Find all h2 titles (accordion headers)
  const h2s = Array.from(cf.querySelectorAll('h2.cmp-title__text'));
  if (h2s.length === 0) return;

  // For each h2, gather its title and content until the next h2
  const rows = [];
  h2s.forEach((h2, idx) => {
    const titleText = h2.textContent.trim();
    const contentNodes = [];
    // Find all nodes between this h2 and the next h2
    let node = h2.parentElement.parentElement.parentElement.nextElementSibling;
    while (node && !(node.querySelector && node.querySelector('h2.cmp-title__text'))) {
      // Only add meaningful content: paragraphs, images, blockquotes
      if (node.matches('p')) {
        contentNodes.push(node);
      } else if (node.matches('div')) {
        node.querySelectorAll('img').forEach(img => contentNodes.push(img));
        node.querySelectorAll('blockquote').forEach(bq => contentNodes.push(bq));
        node.querySelectorAll('p').forEach(p => contentNodes.push(p));
      }
      node = node.nextElementSibling;
    }
    // If no content found, fallback to next p after h2
    if (contentNodes.length === 0) {
      let fallback = h2.parentElement.parentElement.parentElement.nextElementSibling;
      if (fallback && fallback.matches('p')) contentNodes.push(fallback);
    }
    // Only add row if there is content
    if (contentNodes.length > 0) {
      rows.push([
        titleText,
        contentNodes.length === 1 ? contentNodes[0] : contentNodes
      ]);
    }
  });

  // Build the table
  if (rows.length > 0) {
    const headerRow = ['Accordion (accordion31)'];
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
