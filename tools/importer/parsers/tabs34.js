/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root (the element to replace)
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels from the tablist
  const tabListEls = tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab');
  const tabLabels = Array.from(tabListEls).map(li => li.textContent.trim());

  // Extract tab panels, in document order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Assemble rows for the block table
  const rows = [];
  // Header: EXACT match to instructions, including variant
  rows.push(['Tabs (tabs34)']);

  // For each tab, add a row: [label, tab content (existing elements)]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Typical contentfragment structure: contentfragment > article > .cmp-contentfragment__elements
    let contentRoot = panel;
    const cfElements = panel.querySelector('.contentfragment > article .cmp-contentfragment__elements');
    if (cfElements) {
      contentRoot = cfElements;
    }
    // Collect all non-empty nodes, filtering grid wrappers or structural empties
    const nodes = Array.from(contentRoot.childNodes).filter(node => {
      // Remove whitespace text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      // Remove empty grid DIVs
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        ((node.classList && (Array.from(node.classList).some(cls => cls.startsWith('aem-Grid')) || node.classList.contains('aem-GridColumn')))
          || (node.tagName === 'DIV' && node.innerHTML.trim() === ''))
      ) {
        return false;
      }
      // Remove DIV wrappers with only one aem-Grid child
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.children && node.children.length === 1 &&
        node.children[0].classList && Array.from(node.children[0].classList).some(cls => cls.startsWith('aem-Grid'))
      ) {
        return false;
      }
      return true;
    });
    // If there's only one relevant node, use it directly; otherwise use array
    let content;
    if (nodes.length === 1) {
      content = nodes[0];
    } else {
      content = nodes;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block root with the tab block table
  element.replaceWith(table);
}
