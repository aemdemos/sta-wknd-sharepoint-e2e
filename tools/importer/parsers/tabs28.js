/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels (li elements)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // For each tab, get the content panel
  // Only direct children to avoid picking up nested tabs (defensive)
  const tabPanels = Array.from(tabsContainer.children)
    .filter(child => child.classList.contains('cmp-tabs__tabpanel'));

  // Defensive check: only keep as many panels as tabLabels
  const nTabs = Math.min(tabLabels.length, tabPanels.length);

  // Collect rows for block table
  const headerRow = ['Tabs (tabs28)'];
  const cells = [headerRow];

  for (let i = 0; i < nTabs; i++) {
    // Tab label text
    const label = tabLabels[i] && tabLabels[i].textContent.trim() ? tabLabels[i].textContent.trim() : '';
    // Tab panel content (the panel div)
    const panel = tabPanels[i];

    // Collect the main tab content. Use article if present, else panel itself.
    let tabContent = panel.querySelector('article') || panel;

    // If tabContent is empty, fallback to empty string
    let contentCell = tabContent && tabContent.hasChildNodes() ? tabContent : '';

    // Put label and tabContent into the row
    cells.push([label, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
