/* global WebImporter */
export default function parse(element, { document }) {
  // Find main contentfragment section
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;
  // Get all child nodes (h2, p, div, etc); ignore whitespace-only text nodes
  const nodes = Array.from(cfElements.childNodes).filter(n => !(n.nodeType === Node.TEXT_NODE && n.textContent.trim() === ''));
  // Compose table: header first, then one row per section (h2 + following content)
  const rows = [['Accordion (accordion15)']];
  let currentTitle = null;
  let currentContent = [];
  let foundFirstH2 = false;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H2') {
      // If there is a previous section, push it
      if (currentTitle && currentContent.length > 0) {
        rows.push([
          currentTitle,
          currentContent.length === 1 ? currentContent[0] : currentContent.slice(0)
        ]);
      }
      currentTitle = node.textContent.trim();
      currentContent = [];
      foundFirstH2 = true;
    } else if (foundFirstH2) {
      currentContent.push(node);
    }
  }
  // Add last section if exists
  if (currentTitle && currentContent.length > 0) {
    rows.push([
      currentTitle,
      currentContent.length === 1 ? currentContent[0] : currentContent.slice(0)
    ]);
  }
  // Only replace if at least one accordion row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    contentFragment.replaceWith(table);
  }
}
