/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = [];
  tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
    tabLabels.push(tab.textContent.trim());
  });

  // Get the tabpanel contents in the order of tabs
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the rows for the block table
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Prefer to get the main article/contentfragment inside the tab panel
      // If not, fallback to all children
      const contentEls = [];
      // If there is a contentfragment/article, use its children
      const cf = panel.querySelector('article.cmp-contentfragment, .contentfragment');
      if (cf) {
        Array.from(cf.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            contentEls.push(node);
          }
        });
      } else {
        Array.from(panel.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            contentEls.push(node);
          }
        });
      }
      // Remove empty text nodes
      const refinedContents = contentEls.filter(node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === ''));
      // Single node or array
      contentCell = refinedContents.length === 1 ? refinedContents[0] : refinedContents;
    }
    rows.push([label, contentCell]); // <-- Each content row MUST be [label, content]
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
