/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? Array.from(tabList.children) : [];
  const tabLabels = tabItems.map(tab => tab.textContent.trim());

  // Get the tab content panels
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build the rows
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Find the matching panel (assume same order as labels)
    const panel = tabPanels[i];
    if (!panel) continue;
    // The content is usually inside panel.querySelector('.contentfragment') but we just use the full panel content
    // Only take the visible content inside the panel (ignore aria-hidden panels if needed)
    // We'll take the main div inside the tabpanel, which contains the contentfragment
    // Always directly reference the existing contentfragment element if available, otherwise use panel
    const contentFragment = panel.querySelector(':scope > .contentfragment');
    const tabContent = contentFragment ? contentFragment : panel;
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
