/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the root of the tabs block)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  if (!tabLabels.length) return;

  // Get the tabpanel containers, one per tab
  // They should be in the same order as the tab labels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the header row: block name in a single cell
  const headerRow = ['Tabs (tabs18)'];

  // Compose the tab rows: each row is [tab label, tab content]
  const tabRows = tabLabels.map((tab, idx) => {
    const label = tab.textContent.trim();
    const panel = tabPanels[idx];
    let content = '';
    if (panel) {
      // Use the .contentfragment as the content if present and only child
      const mainContent = panel.querySelector(':scope > .contentfragment');
      if (panel.children.length === 1 && mainContent) {
        content = mainContent;
      } else {
        // Otherwise, collect its children (elements and significant text)
        content = Array.from(panel.childNodes).filter(node => (
          node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        ));
      }
    }
    return [label, content];
  });

  // The correct structure per the example is:
  // - Header row: single cell ['Tabs (tabs18)']
  // - Then, for each tab: [tab label, tab content] as row
  const cells = [headerRow, ...tabRows];

  // Create the block table using the helper and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
