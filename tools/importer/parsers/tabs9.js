/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block (.cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (each with class cmp-tabs__tabpanel)
  // Use only direct children of .cmp-tabs to avoid picking up nested tabpanels, but fallback to all if needed
  let tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabPanels.length !== tabLabels.length) {
    // fallback: maybe panels are not in order, try to match by aria-controls
    tabPanels = tabLabels.map(label => {
      const controls = label.getAttribute('aria-controls');
      return controls ? tabsBlock.querySelector(`#${controls}`) : null;
    });
  }

  // Build the table rows, first is the header row
  const rows = [];
  rows.push(['Tabs (tabs9)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // For tab content: reference the entire tabPanel's relevant content
    const tabPanel = tabPanels[i];
    if (!tabPanel) {
      rows.push([labelText, '']);
      continue;
    }
    // Try to find the contentfragment child, else use the panel itself
    const contentFragment = tabPanel.querySelector('.contentfragment') || tabPanel;
    rows.push([labelText, contentFragment]);
  }

  // Create the block table with the specified structure
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the block table
  tabsBlock.replaceWith(table);
}
