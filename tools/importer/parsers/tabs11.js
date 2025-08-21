/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (in DOM order)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Build rows
  const rows = [];
  rows.push(['Tabs (tabs11)']); // Header row, per requirements

  // For each tab, add a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Defensive: some tabs may not have a panel; find by index if possible
    let panel = tabPanels[i];
    // If not, try to match by aria-labelledby
    if (!panel && tabList) {
      const tabId = tabList.querySelectorAll('li[role="tab"]')[i]?.id;
      if (tabId) {
        panel = tabsRoot.querySelector(`[aria-labelledby="${tabId}"]`);
      }
    }
    // Defensive: if still not found, skip
    if (!panel) {
      rows.push([label, '']);
      continue;
    }
    // Find the main content element in the panel: prefer article, fallback to .contentfragment, fallback to all
    let contentElem = panel.querySelector('article') || panel.querySelector('.contentfragment');
    let contentCell;
    if (contentElem) {
      contentCell = contentElem;
    } else {
      // Fallback: all element children of panel, as array
      const elements = Array.from(panel.children);
      if (elements.length === 1) {
        contentCell = elements[0];
      } else if (elements.length > 1) {
        contentCell = elements;
      } else {
        // fallback: empty string
        contentCell = '';
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
