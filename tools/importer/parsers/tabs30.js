/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tab panels (must be in the same order as the labels)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!tabPanels.length || tabPanels.length !== tabItems.length) return;

  // Build the header row exactly as in the spec
  const headerRow = ['Tabs (tabs30)'];

  // Now build each tab row: tab label, tab content
  const rows = tabItems.map((tab, idx) => {
    const label = tab.textContent.trim();
    // Find the panel for this tab (by index, correct for this structure)
    const panel = tabPanels[idx];
    // For semantic and resilient extraction, use the main content fragment within the tab
    let contentEl = null;
    // Prefer the cmp-contentfragment if present, else the first content child of panel, else the panel itself
    contentEl = panel.querySelector('.cmp-contentfragment') || panel.firstElementChild || panel;
    return [label, contentEl];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabs.parentNode.replaceChild(table, tabs);
}
