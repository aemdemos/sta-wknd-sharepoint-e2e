/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = [];
  tabLabels.forEach((tabLabel, idx) => {
    // Defensive: Find the corresponding tabpanel by aria-controls
    const ariaControls = tabLabel.getAttribute('aria-controls');
    const tabPanel = tabsContainer.querySelector(`#${ariaControls}`);
    if (!tabPanel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: get the main contentfragment/article inside the panel
    // Defensive: find the first .contentfragment or article
    let tabContent = tabPanel.querySelector('.contentfragment, article');
    if (!tabContent) {
      // fallback: use all children of tabPanel
      tabContent = document.createElement('div');
      Array.from(tabPanel.childNodes).forEach((node) => tabContent.appendChild(node.cloneNode(true)));
    }

    rows.push([labelText, tabContent]);
  });

  // Table header
  const headerRow = ['Tabs (tabs35)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs element with block table
  tabsContainer.replaceWith(block);
}
