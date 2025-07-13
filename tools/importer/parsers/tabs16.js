/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels (should be in order)
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');
  if (tabPanels.length !== tabLabels.length) return;

  // For each panel, extract the main tab content (whole article or all children)
  const tabContents = Array.from(tabPanels).map(panel => {
    let content = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      const article = contentFragment.querySelector('article');
      if (article) {
        content = article;
      } else {
        // fallback: all non-empty children
        content = Array.from(contentFragment.childNodes).filter(node => {
          return !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '');
        });
        if (content.length === 1) content = content[0];
      }
    } else {
      content = Array.from(panel.childNodes).filter(node => {
        return !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '');
      });
      if (content.length === 1) content = content[0];
    }
    return content;
  });

  // Compose the block table according to the example structure
  // Header row: single column block name
  const headerRow = ['Tabs (tabs16)'];
  // Second row: tab labels, each in its own cell
  const labelsRow = tabLabels;
  // Third row: tab content, each in its own cell, aligned under label
  const contentRow = tabContents;

  const cells = [headerRow, labelsRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
