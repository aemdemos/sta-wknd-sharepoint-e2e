/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelElements = tablist ? Array.from(tablist.querySelectorAll('li')) : [];
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Get all tab panels, ensure order matches tab labels
  const tabPanelElements = tabLabels.map(label => {
    // Each tab <li> has aria-controls to match a tabpanel id
    const tabLi = tabLabelElements.find(li => li.textContent.trim() === label);
    if (!tabLi) return null;
    const tabPanelId = tabLi.getAttribute('aria-controls');
    return tabsRoot.querySelector(`#${tabPanelId}`);
  });

  // Build table rows: first row is header, then each tab (label + content)
  const cells = [["Tabs (tabs38)"]];
  tabLabels.forEach((label, idx) => {
    const panel = tabPanelElements[idx];
    // Reference main contentfragment/article, else whole panel
    let content = null;
    // Prefer article inside panel
    if (panel) {
      content = panel.querySelector('article') || panel;
    }
    cells.push([label, content]);
  });

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(block);
}
