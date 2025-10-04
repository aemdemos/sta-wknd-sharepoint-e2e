/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim());

  // Get all tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build table rows
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, idx) => {
    // Defensive: find matching panel
    const panel = tabPanels[idx];
    if (!panel) return;

    // Find the contentfragment inside the panel
    const fragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    let tabContent;
    if (fragment) {
      // Use the entire fragment for robustness
      tabContent = fragment;
    } else {
      // Fallback: use panel's children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => tabContent.appendChild(node.cloneNode(true)));
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block
  tabsBlock.replaceWith(block);
}
