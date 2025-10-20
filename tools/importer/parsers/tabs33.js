/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer');
  if (!tabsContainer) return;

  // Find the tab navigation (tab headers)
  const tabNav = tabsContainer.querySelector('[role="tablist"]');
  if (!tabNav) return;
  const tabHeaders = Array.from(tabNav.querySelectorAll('[role="tab"]'));

  // Find all tab panels
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: If headers and panels count mismatch, bail
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabHeaders.forEach((tabHeader, i) => {
    // Tab label (text)
    const label = tabHeader.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];

    // Defensive: If panel missing, skip
    if (!panel) return;

    // For resilience, grab all direct children of the tab panel
    // Usually a single .contentfragment or similar
    let tabContent = [];
    // If there is a contentfragment, use it
    const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (cf) {
      tabContent.push(cf);
    } else {
      // Otherwise, push all direct children
      tabContent = Array.from(panel.children);
    }
    // Defensive: If nothing found, fallback to panel itself
    if (tabContent.length === 0) tabContent = [panel];

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
