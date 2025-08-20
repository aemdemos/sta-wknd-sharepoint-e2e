/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs component
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Find all tabpanels (tabpanel order should match the tab order)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Block header: per spec, this must be exactly 'Tabs (tabs3)'
  const rows = [['Tabs (tabs3)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const labelText = label ? label.textContent.trim() : '';
    if (!labelText) continue;

    // Get tabpanel by aria-controls or fall back to ordering
    let tabPanel = null;
    const ariaControls = label.getAttribute('aria-controls');
    if (ariaControls) {
      tabPanel = tabs.querySelector(`#${ariaControls}`);
    } else if (tabPanels[i]) {
      tabPanel = tabPanels[i];
    }
    if (!tabPanel) continue;

    // Referencing the main content block of the tabpanel
    // Usually the first element is .contentfragment
    let tabContent = null;
    for (const child of tabPanel.children) {
      if (child.classList.contains('contentfragment')) {
        tabContent = child;
        break;
      }
    }
    // If not found, fall back to the whole tabPanel
    if (!tabContent) {
      tabContent = tabPanel;
    }
    rows.push([labelText, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
