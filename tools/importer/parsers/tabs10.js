/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element that contains the tab structure
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab label elements (in order)
  const tabLabelEls = Array.from(tabs.querySelectorAll(':scope > .cmp-tabs__tablist > li'));

  // Get all tab panels (in order of appearance in DOM)
  const tabPanels = Array.from(tabs.querySelectorAll(':scope > .cmp-tabs__tabpanel'));

  // Defensive: if not same number of tabs and panels, fallback to all li and tabpanel
  const numTabs = Math.max(tabLabelEls.length, tabPanels.length);

  // Build header row (block name and variant)
  const rows = [['Tabs (tabs10)']];

  for (let i = 0; i < numTabs; i++) {
    // Tab label (from li)
    let label = '';
    if (tabLabelEls[i] && tabLabelEls[i].textContent) {
      label = tabLabelEls[i].textContent.trim();
    }
    // Tab panel content
    let contentCell = '';
    if (tabPanels[i]) {
      // Use all children of the tabpanel as the cell content, but filter out only-empty text nodes
      const children = Array.from(tabPanels[i].childNodes).filter(n => {
        if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
        return true;
      });
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        contentCell = '';
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tab block with the new table
  tabs.replaceWith(table);
}
