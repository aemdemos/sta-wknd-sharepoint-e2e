/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (the element with class 'tabs panelcontainer')
  const tabsBlock = element.closest('.tabs.panelcontainer') || element;

  // Find the cmp-tabs container inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process if we have labels and panels and they match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label
    const label = tabLabels[i];
    // Tab content: use the whole tabpanel content
    const panel = tabPanels[i];
    // Defensive: clone the content to avoid moving it from the DOM
    const panelContent = Array.from(panel.childNodes).map(node => node.cloneNode(true));
    rows.push([
      label,
      panelContent.length === 1 ? panelContent[0] : panelContent
    ]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
