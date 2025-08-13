/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  let cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) {
    // fallback: if top-level is cmp-tabs itself
    if (element.classList.contains('cmp-tabs')) {
      cmpTabs = element;
    } else {
      // fallback: if inside a .tabs.panelcontainer
      const panelTabs = element.querySelector('.tabs.panelcontainer');
      if (panelTabs) {
        cmpTabs = panelTabs.querySelector('.cmp-tabs');
      }
    }
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tablist ? Array.from(tablist.children) : [];
  // Defensive: skip if no tabs found
  if (tabLabels.length === 0) return;

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: skip if no panels found
  if (tabPanels.length === 0) return;

  // Header row as per block name
  const headerRow = ['Tabs (tabs23)'];

  // Tab label row: each cell is a <strong>TabName</strong>
  const tabLabelRow = tabLabels.map(tab => {
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // Tab content row: each cell is the main content of each tabpanel
  const tabContentRow = tabPanels.map(panel => {
    // Find a contentfragment/article or use all content inside the panel
    let content = null;
    // Get all direct children except empty divs or ones with only whitespace
    let children = Array.from(panel.children).filter(child => {
      // Remove empty grid divs
      if (
        child.classList.contains('aem-Grid') ||
        child.classList.contains('aem-Grid--12') ||
        child.classList.contains('aem-Grid--default--12')
      ) {
        return false;
      }
      // Remove empty divs (no text, no element children)
      if (child.tagName === 'DIV' && child.textContent.trim() === '' && child.children.length === 0) {
        return false;
      }
      return true;
    });
    // If only one (likely .contentfragment or article), just use it
    if (children.length === 1) {
      content = children[0];
    } else if (children.length > 1) {
      // If multiple, combine all
      const container = document.createElement('div');
      children.forEach(el => container.appendChild(el));
      content = container;
    } else {
      // fallback: nothing meaningful inside
      content = document.createElement('div');
    }
    return content;
  });

  // Structure: header, tab label row, tab content row
  const cells = [headerRow, tabLabelRow, tabContentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new block
  cmpTabs.replaceWith(block);
}
