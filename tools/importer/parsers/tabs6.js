/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab labels and tab panels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row: block name only, per requirements
  const headerRow = ['Tabs (tabs6)'];

  // Tab label row: each label in its own column (as plain text)
  const tabLabelRow = tabLabels;

  // Tab content row: each tab's content in its own column
  // For each tab panel, get its main contentfragment/article, or all children if none
  const tabContentRow = tabPanels.map(panel => {
    // Prefer first cmp-contentfragment/article, else fallback to all content
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      return cf;
    }
    // else, include all DOM nodes in this panel
    return Array.from(panel.childNodes);
  });

  // Compose table
  const cells = [
    headerRow,            // ["Tabs (tabs6)"]
    tabLabelRow,          // [Tab One, Tab Two, Tab Three]
    tabContentRow         // [content for Tab One, content for Tab Two, content for Tab Three]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace tabs with block table
  tabs.parentNode.replaceChild(block, tabs);
}
