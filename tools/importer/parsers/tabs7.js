/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure tabPanels matches tabLabels
  if (tabPanels.length !== tabLabels.length) return;

  // Build table rows: first row is header
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // Gather all meaningful content from the panel
    const contentFragment = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(node => {
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        contentFragment.appendChild(node);
      }
    });
    rows.push([label, contentFragment]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the block table
  tabsBlock.replaceWith(block);
}
