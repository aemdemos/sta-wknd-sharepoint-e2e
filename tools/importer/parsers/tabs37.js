/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // --- Get the tab labels (li elements) ---
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  if (tabLabels.length === 0) return;

  // --- Get all tabpanel containers ---
  // These are direct children of .cmp-tabs, but may be mixed with other elements
  // We identify them by [role="tabpanel"]
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));
  if (tabPanels.length === 0) return;

  // --- Create block table rows ---
  const rows = [];
  rows.push(['Tabs (tabs37)']); // exact header

  tabLabels.forEach((label) => {
    // Tab label (first cell)
    const tabLabelText = label.textContent.trim();
    // The aria-controls attribute points to the id of the tabpanel
    const tabPanelId = label.getAttribute('aria-controls');
    // Find the tabpanel by id
    const tabPanel = tabPanels.find(panel => panel.id === tabPanelId);
    let tabContentEl = null;
    if (tabPanel) {
      // We want to reference the main tab content element directly (not deeply clone)
      // Remove tabpanel-specific attributes for clean output:
      tabPanel.removeAttribute('role');
      tabPanel.removeAttribute('aria-labelledby');
      tabPanel.removeAttribute('tabindex');
      tabPanel.removeAttribute('data-cmp-hook-tabs');
      tabPanel.removeAttribute('aria-hidden');
      // Try to use the first child if it's a single wrapper div, else the tabPanel itself
      // This helps keep output semantic and clean
      let mainContent = tabPanel;
      if (
        tabPanel.children.length === 1 &&
        tabPanel.firstElementChild.tagName === 'DIV' &&
        tabPanel.firstElementChild.classList.contains('contentfragment')
      ) {
        mainContent = tabPanel.firstElementChild;
      }
      tabContentEl = mainContent;
    } else {
      tabContentEl = '';
    }
    rows.push([tabLabelText, tabContentEl]);
  });

  // Build the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
