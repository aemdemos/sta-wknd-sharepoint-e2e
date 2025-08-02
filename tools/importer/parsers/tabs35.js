/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block to process only that section
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (li[role=tab])
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role=tab]') : []);

  // Get all tab panels (in DOM order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row as a single cell array
  const rows = [['Tabs (tabs35)']];

  // For each tab, build a row [Tab Label, Tab Content]
  tabLabels.forEach((labelElem, idx) => {
    const label = labelElem.textContent.trim();
    // Find corresponding panel by 'aria-controls', fallback to order
    const panelId = labelElem.getAttribute('aria-controls');
    let panel = panelId ? tabs.querySelector('#' + panelId) : tabPanels[idx];
    if (!panel) return;
    // Find a .contentfragment or .cmp-contentfragment, else use all panel children
    let contentElem = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (!contentElem) {
      // Create a div and append all children except scripts/styles
      contentElem = document.createElement('div');
      Array.from(panel.childNodes).forEach(child => {
        if (child.nodeType === 1 && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
          contentElem.appendChild(child);
        } else if (child.nodeType === 3 && child.textContent.trim()) {
          contentElem.appendChild(document.createTextNode(child.textContent));
        }
      });
    }
    rows.push([label, contentElem]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs node with the table
  tabs.replaceWith(table);
}
