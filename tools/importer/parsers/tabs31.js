/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  const cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs') ? tabsContainer.querySelector('.cmp-tabs') : element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels and panels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    const panel = tabPanels[i];
    if (!panel) return;
    const labelText = tabLabel.textContent.trim();
    let tabContent = null;
    const contentFragment = panel.querySelector('.cmp-contentfragment, article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = panel;
    }
    rows.push([labelText, tabContent]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
