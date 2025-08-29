/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class (should be a div with class 'tabs')
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;
  // Inside tabsBlock, find the actual tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels: inside cmp-tabs an <ol> with <li>s
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabTabs = tabList ? Array.from(tabList.children) : [];

  // For each tab, get the label and content
  // Tab panels are divs with class 'cmp-tabs__tabpanel'
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header: block name
  const headerRow = ['Tabs (tabs34)'];

  // For each tab/tabPanel pair, build rows
  const rows = tabPanels.map((panel, idx) => {
    // Get label from tabTabs (same order)
    const label = tabTabs[idx] ? tabTabs[idx].textContent.trim() : '';

    // The content is the whole tab panel's main content
    // Try to get the main contentfragment/article inside this panel
    let content = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Use the entire contentfragment for resilience
      content = contentFragment;
    } else {
      // Fallback: include all children except tabpanel wrapper
      // We'll make a fragment and append all panel's children
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(child => frag.appendChild(child));
      content = frag;
    }
    return [label, content];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsBlock (parent container) with the block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
