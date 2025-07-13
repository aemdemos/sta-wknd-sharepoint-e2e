/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab label elements from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).filter(li => li.classList.contains('cmp-tabs__tab'));

  // Get all tab panels and map by id
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  const panelsById = {};
  tabPanels.forEach(panel => {
    panelsById[panel.id] = panel;
  });

  // Header row as in the block spec
  const headerRow = ['Tabs (tabs22)'];

  // Each row should be [tabLabel, tabContent]
  const rows = tabLabels.map((tabLabel) => {
    const label = tabLabel.textContent ? tabLabel.textContent.trim() : '';
    const panelId = tabLabel.getAttribute('aria-controls');
    const panel = panelsById[panelId];
    let content = '';
    if (panel) {
      // If the panel has exactly 1 main child, use that (usually a div.contentfragment)
      if (panel.children.length === 1) {
        content = panel.children[0];
      } else if (panel.children.length > 1) {
        // If more than 1 child, return all as array
        content = Array.from(panel.children);
      } else {
        // Or use text if only text
        content = panel.innerHTML.trim();
      }
    }
    return [label, content];
  });

  // Compose the table
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the cmp-tabs element with the new block table
  tabsBlock.replaceWith(block);
}
