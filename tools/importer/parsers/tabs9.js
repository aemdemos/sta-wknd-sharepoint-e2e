/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab contents by matching tab panel order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  const tabContents = tabPanels.map(panel => {
    // Prefer the contentfragment/article inside
    let content = panel.querySelector('article.cmp-contentfragment, .contentfragment');
    if (!content) {
      // fallback to all children of tabpanel
      const children = Array.from(panel.children);
      if (children.length) {
        // If there are children, combine all
        const wrapper = document.createElement('div');
        children.forEach(child => wrapper.appendChild(child));
        return wrapper;
      } else {
        // fallback to panel itself
        return panel;
      }
    }
    return content;
  });

  // Prepare the table header row (block name)
  const headerRow = ['Tabs (tabs9)'];

  // Prepare each tab row: [label, content]
  const cells = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // Ensure label exists
    const label = tabLabels[i] || '';
    // Ensure content exists
    let content = tabContents[i];
    if (!content) {
      content = '';
    }
    cells.push([label, content]);
  }

  // Create block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsBlock with the new table
  tabsBlock.replaceWith(blockTable);
}
