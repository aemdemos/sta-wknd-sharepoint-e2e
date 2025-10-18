/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Find tab headers (tab labels)
  const tabList = tabsContainer.querySelector('[role="tablist"], .cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"], .cmp-tabs__tab'));

  // Find tab panels (tab contents)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel'));

  // Defensive check: number of panels should match number of labels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) return;

    // Gather all direct children of the panel's contentfragment (if present)
    let tabContent = [];
    // Find the main contentfragment/article inside the panel
    let contentFragment = panel.querySelector('.contentfragment article, .cmp-contentfragment');
    if (!contentFragment) {
      // fallback: use panel itself
      contentFragment = panel;
    }
    // Get all children except the title
    tabContent = Array.from(contentFragment.children).filter(child => {
      // Remove tab fragment titles
      if (child.classList && child.classList.contains('cmp-contentfragment__title')) return false;
      return true;
    });
    // If nothing found, fallback to all children of panel
    if (tabContent.length === 0) {
      tabContent = Array.from(panel.children);
    }
    // If still nothing, fallback to text
    if (tabContent.length === 0) {
      tabContent = [document.createTextNode(panel.textContent.trim())];
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block table
  tabsContainer.replaceWith(block);
}
