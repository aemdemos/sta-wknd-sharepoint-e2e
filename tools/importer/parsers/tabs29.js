/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels (e.g., Overview, Itinerary, What to Bring)
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Extract tab panels, in order
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Helper: Remove .aem-Grid wrapper divs recursively from an array or element
  function stripGrids(nodes) {
    // nodes: element, array, or single node
    const processNode = (node) => {
      if (!node) return null;
      if (Array.isArray(node)) return node.map(processNode).flat().filter(Boolean);
      if (node.nodeType === 1 && node.classList.contains('aem-Grid')) {
        // Flatten child nodes recursively
        return Array.from(node.childNodes).map(processNode).flat().filter(Boolean);
      }
      if (node.nodeType === 1 && node.children && node.children.length > 0) {
        // Remove grid wrappers from children
        const clone = node.cloneNode(false);
        Array.from(node.childNodes).forEach(child => {
          const result = processNode(child);
          if (Array.isArray(result)) {
            result.forEach(r => r && clone.appendChild(r));
          } else if (result) {
            clone.appendChild(result);
          }
        });
        // Remove empty nodes
        if (clone.childNodes.length === 0 && !clone.textContent.trim()) return null;
        return clone;
      }
      if (node.nodeType === 3 && !node.textContent.trim()) return null;
      return node;
    };
    if (Array.isArray(nodes)) {
      return nodes.map(processNode).flat().filter(Boolean);
    } else {
      return processNode(nodes);
    }
  }

  // Helper: Extract content for each tab panel
  function extractRelevantContent(panel) {
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      const article = cf.querySelector('article');
      if (article) {
        // Main content in .cmp-contentfragment__elements
        const cfElements = article.querySelector('.cmp-contentfragment__elements');
        let contentNodes = [];
        if (cfElements) {
          contentNodes = Array.from(cfElements.childNodes).filter(n =>
            !(n.nodeType === 3 && !n.textContent.trim()) // Remove empty text nodes
          );
        }
        // Optionally prepend the contentfragment__title if present and not empty
        const title = article.querySelector('.cmp-contentfragment__title');
        if (title && (!contentNodes.length || contentNodes[0] !== title)) {
          contentNodes.unshift(title);
        }
        // Remove grid wrappers
        const cleaned = stripGrids(contentNodes);
        return cleaned.length === 1 ? cleaned[0] : cleaned;
      }
    }
    // fallback: return all childNodes except empty text and grid wrappers
    let nodes = Array.from(panel.childNodes).filter(n =>
      !(n.nodeType === 3 && !n.textContent.trim())
    );
    const cleaned = stripGrids(nodes);
    return cleaned.length === 1 ? cleaned[0] : cleaned;
  }

  // Compose the table rows
  // First row: single cell with block name
  const rows = [['Tabs (tabs29)']];
  // Each tab: row [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const content = extractRelevantContent(tabPanels[i]);
    rows.push([label, content]);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
