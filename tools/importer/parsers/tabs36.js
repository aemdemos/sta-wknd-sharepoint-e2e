/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels and corresponding panel IDs
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);
  // Map tab panel ids for order
  const tabPanelIds = tabLabelEls.map(tab => tab.getAttribute('aria-controls'));

  // Get all tabpanel blocks in the order of tabPanelIds
  const tabPanels = tabPanelIds.map(id => tabsBlock.querySelector(`#${id}`)).filter(Boolean);

  // Prepare table header
  const headerRow = ['Tabs (tabs36)'];
  const cells = [headerRow];

  // For each tab, get the label and the main content section
  for (let i = 0; i < tabLabelEls.length; i++) {
    const tabLabel = tabLabelEls[i].textContent.trim();
    const panel = tabPanels[i];
    let content = null;
    // Grab the first non-empty .contentfragment child or fallback to all children
    if (panel) {
      const cf = panel.querySelector('.contentfragment');
      if (cf) {
        content = cf;
      } else {
        // Fallback: create a div and move all children (to preserve references, use the elements directly)
        const children = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
        if (children.length === 1) {
          content = children[0];
        } else if (children.length > 1) {
          content = children;
        } else {
          // Fallback: empty string (should not happen)
          content = '';
        }
      }
      cells.push([tabLabel, content]);
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
