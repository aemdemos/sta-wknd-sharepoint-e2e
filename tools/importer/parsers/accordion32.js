/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article content
  const mainArticle = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!mainArticle) return;

  // Block header row
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];

  // Find the content container
  const cfElements = mainArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Gather all nodes in cmp-contentfragment__elements in order
  const sectionNodes = Array.from(cfElements.childNodes);

  // Helper: is this node a section title (h2)?
  function isSectionTitle(node) {
    return node.nodeType === 1 && node.querySelector && node.querySelector('h2.cmp-title__text');
  }

  // Helper: collect all nodes between two indices (inclusive start, exclusive end)
  function collectContent(nodes, start, end) {
    return nodes.slice(start, end).filter((node) => {
      if (node.nodeType === 1 && node.classList.contains('aem-Grid')) return false;
      if (node.nodeType === 1 && node.classList.contains('aem-GridColumn')) return false;
      if (node.nodeType === 3 && !node.textContent.trim()) return false;
      return true;
    });
  }

  // Find all section title indices
  const sectionIndices = [];
  sectionNodes.forEach((node, idx) => {
    if (isSectionTitle(node)) {
      sectionIndices.push(idx);
    }
  });

  // Add a virtual section at the end
  sectionIndices.push(sectionNodes.length);

  // First: intro section (before first h2)
  if (sectionIndices.length > 1 && sectionIndices[0] > 0) {
    const introContentNodes = collectContent(sectionNodes, 0, sectionIndices[0]);
    if (introContentNodes.length) {
      let introTitle = mainArticle.querySelector('h3.cmp-contentfragment__title');
      if (!introTitle) {
        introTitle = mainArticle.querySelector('h1, h2, h3');
      }
      const titleCell = introTitle ? introTitle.cloneNode(true) : 'Introduction';
      rows.push([
        titleCell,
        introContentNodes
      ]);
    }
  }

  // For each section (h2), collect its content until the next h2
  for (let i = 0; i < sectionIndices.length - 1; i++) {
    const startIdx = sectionIndices[i];
    const endIdx = sectionIndices[i + 1];
    const sectionNode = sectionNodes[startIdx];
    if (!isSectionTitle(sectionNode)) continue;
    const h2 = sectionNode.querySelector('h2.cmp-title__text');
    const titleCell = h2 ? h2.cloneNode(true) : 'Section';
    const contentNodes = collectContent(sectionNodes, startIdx + 1, endIdx);
    if (contentNodes.length) {
      rows.push([
        titleCell,
        contentNodes
      ]);
    }
  }

  // Replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
