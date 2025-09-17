/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row with the required block name
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  // For each tab, pair label and content
  tabLabels.forEach((tabLabel, i) => {
    // Find matching panel by aria-controls
    const controlsId = tabLabel.getAttribute('aria-controls');
    const panel = tabPanels.find(p => p.id === controlsId);
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: use the direct contentfragment/article inside panel if present
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    rows.push([labelText, tabContent]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original tabs element with block table
  tabsContainer.replaceWith(table);
}
