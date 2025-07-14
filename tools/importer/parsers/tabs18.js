/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find all the tab labels and corresponding tab panel IDs
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabInfos = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      const label = li.textContent.trim();
      const ariaControls = li.getAttribute('aria-controls');
      if (label && ariaControls) {
        tabInfos.push({ label, ariaControls });
      }
    });
  }

  // Build the rows for the table: header first, then one row per tab
  const cells = [ ['Tabs (tabs18)'] ];
  tabInfos.forEach(({ label, ariaControls }) => {
    let content = '';
    const panel = tabs.querySelector(`#${ariaControls}`);
    if (panel) {
      // Prefer .contentfragment if present, else use the panel itself
      const contentFragment = panel.querySelector('.contentfragment');
      content = contentFragment ? contentFragment : panel;
    }
    cells.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
