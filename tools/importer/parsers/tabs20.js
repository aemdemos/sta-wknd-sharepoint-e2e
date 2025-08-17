/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Prepare the header row exactly as in example
  const rows = [['Tabs (tabs20)']];

  // For each tab, grab its label and main content
  tabLabels.forEach((tab) => {
    // Tab label (dynamic)
    const label = tab.textContent.trim();
    // Find the tab's panel
    const tabPanelId = tab.getAttribute('aria-controls');
    let panel = tabPanelId ? tabs.querySelector(`#${tabPanelId}`) : null;

    // Defensive: If panel missing, just add label and empty string
    if (!panel) {
      rows.push([label, '']);
      return;
    }

    // The primary tab content is typically the contentfragment/article in the panel
    // Reference the existing element (not clone)
    let mainContent = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (!mainContent) {
      // fallback to first non-empty element (eg. paragraph, image, etc.)
      mainContent = Array.from(panel.children).find((child) => child.textContent.trim() || child.querySelector('img')) || panel;
    }

    rows.push([label, mainContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block in the DOM
  tabs.replaceWith(block);
}
