/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element inside the provided root element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Block header row
  const headerRow = ['Tabs (tabs3)'];

  // Extract tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Extract corresponding tabpanel elements (ordered)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // For each tab, create a row: [label, content]
  const rows = tabLabels.map((label, idx) => {
    const panel = tabPanels[idx];
    let tabContent;
    if (panel) {
      // Typical structure: panel contains one main child (".contentfragment")
      // If there's exactly one child, use that; else use the panel itself
      // We avoid cloning/creating new elements: reference only existing nodes
      // Get all direct children except empty divs for robustness
      let mainFragment = panel.querySelector(':scope > .contentfragment, :scope > article, :scope > div:not(:empty), :scope > ul, :scope > p, :scope > h2');
      if (mainFragment) {
        tabContent = mainFragment;
      } else {
        tabContent = panel;
      }
    } else {
      // No panel found; set empty string
      tabContent = '';
    }
    return [label, tabContent];
  });

  // Compose full table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace tabsRoot (not the whole element) with the created block table
  tabsRoot.parentNode.replaceChild(table, tabsRoot);
}
