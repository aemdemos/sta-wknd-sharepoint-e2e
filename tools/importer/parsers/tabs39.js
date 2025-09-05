/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements inside ol[role=tablist])
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row (must use block name as per spec)
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    const labelText = labelEl.textContent.trim();
    const panelEl = tabPanels[i];
    // Defensive: If panelEl exists, use its content
    let tabContent;
    if (panelEl) {
      // Use the actual DOM node reference for the content cell
      tabContent = panelEl;
    } else {
      tabContent = document.createTextNode('');
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
