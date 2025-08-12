/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by looking for a cmp-tabs class inside the current element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;
  // Get all tab labels (the <li> elements inside tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (the <div> with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Header row: two columns, first is block name, second is empty string
  const headerRow = ['Tabs (tabs20)', ''];
  // Each tab row: [label, content]
  const bodyRows = tabLabels.map((li, i) => {
    const label = li.textContent.trim();
    let content = '';
    const tabPanel = tabPanels[i];
    if (tabPanel) {
      // Place all tabPanel children in a wrapper div
      const wrapper = document.createElement('div');
      Array.from(tabPanel.childNodes).forEach(node => {
        wrapper.appendChild(node);
      });
      content = wrapper;
    }
    return [label, content];
  });
  // Table cells: header + all tab rows
  const cells = [headerRow, ...bodyRows];
  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
