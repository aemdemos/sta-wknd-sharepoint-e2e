/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block in the hierarchy
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const tabs = tabsContainer.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all the tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tab panel contents, in order
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build table header row as required by the block spec
  const headerRow = ['Tabs (tabs18)'];

  // Compose each tab row: [Label, Content]
  const rows = tabLabels.map((tab, i) => {
    // Tab label
    const label = tab.textContent.trim();

    // Tab content: reference the article within the panel if present for robustness
    const panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // Prefer the direct content fragment/article inside the panel
      const fragment = panel.querySelector('article');
      if (fragment) {
        tabContent = fragment;
      } else {
        // Otherwise, reference all children inside the tabpanel
        tabContent = document.createElement('div');
        Array.from(panel.childNodes).forEach(node => tabContent.appendChild(node));
      }
    } else {
      // If no panel, leave content blank
      tabContent = '';
    }
    return [label, tabContent];
  });

  // The table structure: first row is header, then one row per tab (label, content)
  const tableCells = [headerRow, ...rows];

  // Create the block table using WebImporter.DOMUtils.createTable
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the full tabs block with the generated table
  tabsContainer.replaceWith(blockTable);
}
