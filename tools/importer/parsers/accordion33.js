/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-contentfragment article (main content)
  const cfArticle = element.querySelector('article.cmp-contentfragment--san-diego-surfspots');
  if (!cfArticle) return;
  const elementsDiv = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!elementsDiv) return;

  // Get all childNodes (include text, comments, elements)
  const nodes = Array.from(elementsDiv.childNodes);

  // Find the indices of all H2s (each one starts a new accordion item)
  const h2Indices = nodes
    .map((node, idx) => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H2' ? idx : -1))
    .filter(idx => idx !== -1);

  // If no H2s found, nothing to do
  if (h2Indices.length === 0) return;

  // Gather accordion rows
  const rows = [["Accordion (accordion33)"]];
  for (let i = 0; i < h2Indices.length; i++) {
    const startIdx = h2Indices[i];
    const endIdx = h2Indices[i + 1] !== undefined ? h2Indices[i + 1] : nodes.length;
    const titleNode = nodes[startIdx];
    // Collect all nodes after this H2 up to next H2 (or end)
    const contentNodes = nodes.slice(startIdx + 1, endIdx).filter(node => {
      // Remove empty text nodes or empty elements
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim() !== '';
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Remove empty divs and elements
        if ((node.innerHTML !== undefined && node.innerHTML.trim() === '')) return false;
        return true;
      }
      return false;
    });
    // Only add this accordion row if it has content
    if (contentNodes.length) {
      rows.push([titleNode, contentNodes]);
    }
  }

  // Only replace if at least one accordion item found
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    cfArticle.replaceWith(table);
  }
}
