/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabPanels.length !== tabLabels.length) return;

  // Build table header row
  const cells = [['Tabs (tabs14)']];

  // For each tab, add a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Prefer a contentfragment if present
    let content = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (content) {
      cells.push([label, content]);
      continue;
    }
    // Otherwise include all meaningful children
    const children = Array.from(panel.children).filter(el => {
      if (el.classList.contains('aem-Grid')) return false;
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return false;
      return true;
    });
    if (children.length === 1) {
      cells.push([label, children[0]]);
    } else if (children.length > 1) {
      cells.push([label, children]);
    } else {
      // Fallback: use panel itself
      cells.push([label, panel]);
    }
  }

  // Create the table and replace the cmp-tabs element only
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(block);
}
