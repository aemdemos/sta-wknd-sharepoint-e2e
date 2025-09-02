/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels and their corresponding panels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Make sure number of labels and panels match
  // If not, use the minimum length
  const tabCount = Math.min(tabLabelEls.length, tabPanels.length);

  // Build the header row with the block name exactly as required
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabelEls[i].textContent.trim();
    const panel = tabPanels[i];
    let tabContent = [];
    // Prefer referencing the .contentfragment inside the tabpanel
    const contentFragment = panel.querySelector('article.cmp-contentfragment, .contentfragment');
    if (contentFragment) {
      tabContent.push(contentFragment);
    } else {
      // Fallback: get all children nodes of the panel (excluding script/style)
      tabContent = Array.from(panel.children).filter(child => child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE');
    }
    // If no children, try the textContent
    if (tabContent.length === 0) {
      if (panel.textContent && panel.textContent.trim()) {
        tabContent = [document.createTextNode(panel.textContent.trim())];
      } else {
        tabContent = [''];
      }
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the blockTable
  element.replaceWith(blockTable);
}
