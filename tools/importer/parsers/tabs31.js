/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (they are <li> elements)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li.cmp-tabs__tab') : []);

  // Get all tab panels, in DOM order
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the header row as specified in the block info
  const headerRow = ['Tabs (tabs31)'];

  // Prepare the table data: each row is [Tab Label, Tab Content]
  const data = [headerRow];

  // For each label/tab, get its content
  tabLabels.forEach((label) => {
    // Try to find the linked tab panel via aria-controls
    const ariaControls = label.getAttribute('aria-controls');
    let panel = null;
    if (ariaControls) {
      panel = tabsContainer.querySelector(`#${ariaControls}`);
    }
    // If not found, fallback to index
    if (!panel) {
      // Try to match by textContent index if possible
      const idx = tabLabels.indexOf(label);
      panel = tabPanels[idx] || null;
    }
    // The tab label (string)
    const tabLabel = label.textContent.trim();
    // The panel content (reference to the main content element)
    let contentElem = null;
    if (panel) {
      // Grab the contentfragment/article block if present, else the whole panel
      let cf = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
      contentElem = cf || panel;
    } else {
      // fallback: empty div
      contentElem = document.createElement('div');
    }
    // Add this tab row
    data.push([tabLabel, contentElem]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(data, document);
  element.replaceWith(table);
}
