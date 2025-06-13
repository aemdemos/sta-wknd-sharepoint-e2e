/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Helper to check node types without relying on global Node
  function isElement(node) {
    return node && node.nodeType === 1;
  }
  function isComment(node) {
    return node && node.nodeType === 8;
  }

  // Extract tab labels and nodes
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabNodes = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = tabNodes.map(tab => tab.textContent.trim());

  // Map tabpanel IDs to their panel elements
  const tabIdToPanel = {};
  tabsBlock.querySelectorAll('.cmp-tabs__tabpanel[data-cmp-hook-tabs="tabpanel"]').forEach(panel => {
    const labelledby = panel.getAttribute('aria-labelledby');
    if (labelledby) {
      tabIdToPanel[labelledby] = panel;
    }
  });

  // For each tab, find the corresponding tabpanel using aria-labelledby
  const tabRows = tabNodes.map(tabNode => {
    const label = tabNode.textContent.trim();
    const tabId = tabNode.getAttribute('id');
    const panel = tabId ? tabIdToPanel[tabId] : null;
    let contentCell = '';
    if (panel) {
      // Get all direct children (excluding comments, empty grids, script/style)
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        if (isComment(node)) return false;
        if (isElement(node)) {
          const tag = node.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE') return false;
          if (tag === 'DIV' && node.classList.contains('aem-Grid')) {
            return node.textContent.trim().length > 0;
          }
        }
        return true;
      });
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      }
    }
    return [label, contentCell];
  });

  // Compose table as per example: header, then one row per tab (label, content)
  const tableCells = [["Tabs (tabs6)"]].concat(tabRows);
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
