/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels in order
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tab'));
  // Get all tab panels (tab content) in order
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row matches the block name exactly
  const headerRow = ['Tabs (tabs28)'];
  const cells = [headerRow];

  // For each tab, add its label and referenced content element(s)
  tabLabels.forEach((tabLabel) => {
    // Tab label
    const label = tabLabel.textContent.trim();
    // Find the tabpanel associated with this tab label
    const tabPanelId = tabLabel.getAttribute('aria-controls');
    const contentPanel = tabPanels.find(panel => panel.id === tabPanelId);
    let tabContent;
    if (contentPanel) {
      // Reference the main contentfragment/article inside each panel
      const fragment = contentPanel.querySelector('.cmp-contentfragment');
      if (fragment) {
        tabContent = fragment;
      } else {
        // If no contentfragment, get all element children of panel
        tabContent = Array.from(contentPanel.children);
      }
    } else {
      tabContent = '';
    }
    cells.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs container with the block table
  tabsContainer.parentNode.replaceChild(block, tabsContainer);
}
