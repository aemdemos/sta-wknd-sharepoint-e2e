/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Find the tab navigation (tab headers)
  const tabNav = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;

  // Get tab labels
  const tabLabels = Array.from(tabNav.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs13)']);

  // Each tab: [Tab Label, Tab Content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;

    // Extract the content for this tab
    // Use the whole contentfragment/article inside the tabpanel if present
    let tabContent = document.createElement('div');
    const cf = panel.querySelector('.cmp-contentfragment, article');
    if (cf) {
      // Reference the actual children (not clone)
      Array.from(cf.childNodes).forEach(child => {
        tabContent.appendChild(child);
      });
    } else {
      Array.from(panel.childNodes).forEach(child => {
        tabContent.appendChild(child);
      });
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
