/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels in order from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tabpanels (they are in order matching tab labels)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the table rows
  const rows = [];
  // First row is the block header, exactly as required
  rows.push(['Tabs (tabs15)']);
  // Each subsequent row: tab label in first cell, content in second cell
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue; // Defensive: skip if panels/labels are mismatched
    // We preserve the semantic meaning and reference all direct children of the tabpanel
    // We use the childNodes so all structure is preserved, including text, elements, etc.
    const panelContent = Array.from(panel.childNodes).filter(n => {
      // Remove empty text nodes (whitespace)
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return true;
    });
    rows.push([label, panelContent]);
  }

  // Create the block table and replace the original tabs block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.replaceWith(block);
}
