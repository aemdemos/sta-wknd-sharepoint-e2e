/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabTabs = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  const tabLabels = tabTabs.map(tab => tab.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Gather tab contents (prefer .contentfragment, fallback to all children)
  const tabContents = tabPanels.map(tabPanel => {
    let contentNodes = [];
    const contentFragment = tabPanel.querySelector('.contentfragment');
    if (contentFragment) {
      contentNodes.push(contentFragment);
    } else {
      contentNodes = Array.from(tabPanel.children).filter(child => {
        if (child.tagName === 'DIV' && child.classList.contains('aem-Grid')) return false;
        if (!child.textContent.trim() && child.children.length === 0) return false;
        return true;
      });
    }
    return contentNodes.length === 1 ? contentNodes[0] : contentNodes;
  });

  // Build table structure: first row is [Tabs (tabs18)], second row is all tab labels, then next row is all tab contents
  const rows = [];
  rows.push(['Tabs (tabs18)']);
  rows.push(tabLabels);
  rows.push(tabContents);

  // Create the block table and replace the tabs element with it
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
