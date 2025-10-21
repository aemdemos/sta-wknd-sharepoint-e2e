/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  const cmpTabs = tabsRoot ? tabsRoot.querySelector('.cmp-tabs') : element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (from tablist)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[i];
    if (!panel) return;
    let tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
    if (!tabContent) tabContent = panel;
    rows.push([label, tabContent.cloneNode(true)]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
