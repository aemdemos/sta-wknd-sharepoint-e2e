/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs container within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Header row as per block requirements
  const headerRow = ['Tabs (tabs29)'];
  const rows = [headerRow];

  // Get tab labels (li elements inside ol[role=tablist])
  const tabList = tabs.querySelector('ol[role="tablist"]');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"]'));

  // For each tab, pair label and content
  tabLabels.forEach((labelEl, idx) => {
    // Defensive: get tab label text
    const label = labelEl.textContent.trim();
    // Defensive: get corresponding tab panel
    // Try to match by aria-controls/id
    let panel;
    const ariaControls = labelEl.getAttribute('aria-controls');
    if (ariaControls) {
      panel = tabs.querySelector(`#${ariaControls}`);
    }
    if (!panel) {
      // fallback to index
      panel = tabPanels[idx];
    }
    // Defensive: get tab content
    let content = null;
    if (panel) {
      // The content is typically the first child (e.g., .contentfragment)
      // We'll grab all children except for possible empty grid wrappers
      // Find the first non-empty child
      let mainContent = null;
      for (const child of panel.children) {
        if (child.textContent.trim().length > 0) {
          mainContent = child;
          break;
        }
      }
      // Fallback: use panel itself
      content = mainContent || panel;
    }
    // Add row: [Tab Label, Tab Content]
    if (label && content) {
      rows.push([label, content]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the new table
  tabs.replaceWith(table);
}
