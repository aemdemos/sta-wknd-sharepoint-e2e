/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Locate tab labels (li elements in .cmp-tabs__tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children);

  // Locate the tab panels (.cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the table header row exactly as specified
  const rows = [['Tabs (tabs8)']];

  // Edge-case handling: If there are no tabs, nothing to do
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // For each tab, find its label and corresponding panel content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find the panel for this tab
    let panel = null;
    // Determine the panel by aria-controls or by index fallback
    const controlsId = tabLabels[i].getAttribute('aria-controls');
    if (controlsId) {
      panel = tabs.querySelector(`#${controlsId}`);
    }
    // Fallback to panel by index if not found by ID
    if (!panel && tabPanels[i]) {
      panel = tabPanels[i];
    }
    // Edge-case: If still missing, skip this tab
    if (!panel) continue;
    rows.push([label, panel]);
  }

  // Create the block table using referenced elements
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  tabs.replaceWith(blockTable);
}
