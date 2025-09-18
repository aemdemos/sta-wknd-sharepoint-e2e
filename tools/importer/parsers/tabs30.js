/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels and corresponding tab panels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row as per requirements
  const rows = [["Tabs (tabs30)"]];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find the matching panel by aria-controls
    let panel = null;
    const ariaControls = tabLabels[i].getAttribute('aria-controls');
    if (ariaControls) {
      panel = tabs.querySelector(`#${ariaControls}`);
    }
    if (!panel && tabPanels[i]) {
      panel = tabPanels[i];
    }
    if (!panel) continue;
    // Find the main content inside the panel
    let content = null;
    // Look for a .contentfragment or the first non-empty child
    content = panel.querySelector('.contentfragment') || Array.from(panel.children).find(child => child.textContent.trim().length > 0);
    if (!content) content = panel;
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(block);
}
