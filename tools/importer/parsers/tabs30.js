/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Build rows: header first
  const rows = [['Tabs (tabs30)']];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel) => {
    // Find corresponding panel by aria-controls
    const panelId = tabLabel.getAttribute('aria-controls');
    const panel = tabs.querySelector(`#${panelId}`);
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab content: use the whole panel content
    // Find the main content fragment inside panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }
    rows.push([labelText, tabContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original tabs element with block
  tabs.replaceWith(block);
}
