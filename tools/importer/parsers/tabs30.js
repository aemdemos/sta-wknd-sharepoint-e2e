/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from <ol> > <li>
  const tabList = tabs.querySelector('ol.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim());
  }

  // Get panels in order
  const tabPanels = tabLabels.map(label => {
    // Try to match via aria-labelledby
    const li = Array.from(tabList.querySelectorAll('li[role="tab"]')).find(l => l.textContent.trim() === label);
    if (li && li.hasAttribute('aria-controls')) {
      const tabpanelId = li.getAttribute('aria-controls');
      const panel = tabs.querySelector(`#${tabpanelId}`);
      return panel;
    }
    // fallback: index order
    return Array.from(tabs.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]'))[tabLabels.indexOf(label)] || null;
  });

  // Build the table rows
  const rows = [];
  // Header row as in requirements
  rows.push(['Tabs (tabs30)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent = [];
    if (panel) {
      // Find the main .contentfragment inside this panel, or fallback to all element children
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        tabContent = [contentFragment];
      } else {
        // fallback: gather all child elements
        tabContent = Array.from(panel.children);
      }
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
