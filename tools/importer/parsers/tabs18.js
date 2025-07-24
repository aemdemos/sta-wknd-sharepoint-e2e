/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab panels (order matches tabLabels)
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Compose table rows: header row first, then each tab as [label, content] row
  const cells = [ [ 'Tabs (tabs18)' ] ];
  tabLabels.forEach((label, idx) => {
    const strong = document.createElement('strong');
    strong.textContent = label;
    const panel = tabPanels[idx];
    const content = [];
    if (panel) {
      for (const child of panel.children) {
        content.push(child);
      }
      if (content.length === 0 && panel.textContent.trim()) {
        content.push(document.createTextNode(panel.textContent.trim()));
      }
    }
    cells.push([strong, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs element with the new block table
  tabs.replaceWith(block);
}
