/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the .cmp-tabs inside the tabsContainer
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the list of tab labels (li elements in the tablist)
  const tabLabelEls = cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Get the tab panels (in order)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build the table header: block name in single column, then tab labels row, then content rows
  const headerRow = ['Tabs (tabs19)'];
  const labelRow = tabLabels;

  // Compose the content row: each tab's content in the corresponding order
  // For each tab, reference existing panel DOM elements and remove redundant tab-specific titles (e.g. h3.cmp-contentfragment__title)
  const contentCells = tabPanels.map((panel) => {
    // Find the main content fragment/article or .contentfragment inside the panel
    let mainContent = panel.querySelector('article.cmp-contentfragment, .contentfragment');
    if (!mainContent) mainContent = panel;
    // Remove redundant tab title if present
    const tabTitle = mainContent.querySelector('.cmp-contentfragment__title');
    if (tabTitle) tabTitle.remove();
    // Compose a fragment containing all main content nodes
    const frag = document.createDocumentFragment();
    Array.from(mainContent.childNodes).forEach(node => {
      frag.appendChild(node);
    });
    return frag;
  });

  // Table structure: header (row 1), then row of tab labels, then row of tab contents (matching the markdown's 2-column, multi-row structure)
  const tableRows = [
    headerRow,
    labelRow,
    contentCells
  ];

  // Transpose to get rows of [label, content], as in example
  const bodyRows = tabLabels.map((label, idx) => [label, contentCells[idx]]);
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...bodyRows
  ], document);

  // Replace the entire tabs container with the new block table
  tabsContainer.replaceWith(table);
}
