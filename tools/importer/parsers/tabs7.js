/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab label elements (li)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (divs with class cmp-tabs__tabpanel)
  let tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Robustness: filter only direct children of the cmp-tabs
  tabPanels = tabPanels.filter(panel => panel.parentElement === tabsBlock);
  // If not the same length, fallback to all with data-cmp-hook-tabs="tabpanel"
  if (tabPanels.length !== tabLabelEls.length) {
    tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  }

  // Defensive for missing panel/label alignment
  if (tabPanels.length !== tabLabelEls.length) {
    // Mismatch, can't reliably extract
    return;
  }

  // Build the header row (block name exactly as specified)
  const headerRow = ['Tabs (tabs7)'];

  // Compose each row: [tab label, tab content]
  const rows = tabLabelEls.map((tabLabelEl, idx) => {
    // Tab label: Use a <strong> node, but reference label, don't clone or create unnecessarily
    const labelText = tabLabelEl.textContent.trim();
    const labelStrong = document.createElement('strong');
    labelStrong.textContent = labelText;

    // Tab content: reference the main content inside the tab panel
    const tabPanel = tabPanels[idx];
    // Try to find .cmp-contentfragment or .contentfragment as the main content, else fallback to panel's contents
    let tabContentEl = tabPanel.querySelector('.cmp-contentfragment, .contentfragment');
    if (!tabContentEl) {
      // Fallback: gather all panel children, except empty grid divs
      const meaningfulChildren = Array.from(tabPanel.childNodes).filter(node => {
        // filter out empty divs with grid classes
        if (node.nodeType === 1 && node.tagName === 'DIV') {
          const cls = node.className || '';
          if (/aem-Grid/.test(cls) && node.innerText.trim() === '') return false;
        }
        // filter out empty text nodes
        if (node.nodeType === 3 && node.textContent.trim() === '') return false;
        return true;
      });
      if (meaningfulChildren.length === 1) {
        tabContentEl = meaningfulChildren[0];
      } else if (meaningfulChildren.length > 1) {
        // Compose a wrapper div to hold all
        const wrapper = document.createElement('div');
        meaningfulChildren.forEach(child => wrapper.appendChild(child));
        tabContentEl = wrapper;
      } else {
        // fallback: empty div
        tabContentEl = document.createElement('div');
      }
    }
    // Reference content, do not clone
    return [labelStrong, tabContentEl];
  });

  // Compose cells for the block table
  const cells = [headerRow, ...rows];
  
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new structure
  tabsBlock.replaceWith(table);
}
