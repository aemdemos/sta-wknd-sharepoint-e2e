/* global WebImporter */
export default function parse(element, { document }) {
  // Find the article containing the main content
  const article = element.querySelector('article.cmp-contentfragment');
  if (!article) return;

  // Find the content root
  const contentRoot = article.querySelector('.cmp-contentfragment__elements > div');
  if (!contentRoot) return;

  // Get all direct children, filtering out empty text nodes and empty grid wrappers
  const allNodes = Array.from(contentRoot.childNodes).filter(node => {
    // Remove empty text nodes
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
    // Remove empty grid wrappers
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.classList.contains('aem-Grid') && !node.textContent.trim()) return false;
    return true;
  });

  // Identify section indexes (accordion items): these are divs containing h2.cmp-title__text
  let sectionIndexes = [];
  allNodes.forEach((node, idx) => {
    if (node.nodeType === 1) {
      let h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
      if (h2) sectionIndexes.push(idx);
    }
  });

  // Build accordion table rows
  const rows = [['Accordion (accordion9)']]; // Header row, per the example

  // Content before first accordion section, treat as 'Overview' if present
  if (sectionIndexes.length > 0 && sectionIndexes[0] > 0) {
    // Build overview title (not hardcoded, but as a div for semantic)
    const overviewDiv = document.createElement('div');
    overviewDiv.textContent = 'Overview';
    const overviewContent = document.createElement('div');
    for (let i = 0; i < sectionIndexes[0]; i++) {
      overviewContent.appendChild(allNodes[i]);
    }
    if (overviewContent.childNodes.length > 0) {
      rows.push([overviewDiv, overviewContent]);
    }
  }

  // Each accordion section, from each h2 to before the next h2
  for (let i = 0; i < sectionIndexes.length; i++) {
    const startIdx = sectionIndexes[i];
    const endIdx = ((i + 1) < sectionIndexes.length) ? sectionIndexes[i + 1] : allNodes.length;
    // Always use the existing h2 element for title
    let h2Node = allNodes[startIdx].querySelector && allNodes[startIdx].querySelector('h2.cmp-title__text');
    let titleCell = h2Node ? h2Node : allNodes[startIdx];
    // Content cell: everything after the h2 node up to before the next h2
    const sectionContent = document.createElement('div');
    for (let j = startIdx + 1; j < endIdx; j++) {
      sectionContent.appendChild(allNodes[j]);
    }
    if (sectionContent.childNodes.length > 0) {
      rows.push([titleCell, sectionContent]);
    }
  }

  // If there is NO h2 section, create a single section with all content
  if (rows.length === 1 && allNodes.length > 0) {
    const onlyTitle = document.createElement('div');
    onlyTitle.textContent = 'Section';
    const onlyContent = document.createElement('div');
    allNodes.forEach(node => onlyContent.appendChild(node));
    rows.push([onlyTitle, onlyContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
