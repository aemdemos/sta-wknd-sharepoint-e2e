/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements inside the tablist)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist li'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Prepare the header row (must match exactly)
  const headerRow = ['Tabs (tabs19)'];
  // Prepare the cells (header row first)
  const cells = [headerRow];

  // For each tab, collect its label and content
  tabLabels.forEach((tabLabel, idx) => {
    // The text for the tab (1st column)
    const label = tabLabel.textContent.trim();
    // Try to find the matching tab panel by aria-controls
    let tabPanel = null;
    const ariaControls = tabLabel.getAttribute('aria-controls');
    if (ariaControls) {
      tabPanel = tabsBlock.querySelector(`#${ariaControls}`);
    }
    // Fallback: use index if not found by id
    if (!tabPanel && tabPanels[idx]) {
      tabPanel = tabPanels[idx];
    }
    // Defensive: fallback to blank cell if nothing found
    let content = '';
    if (tabPanel) {
      // Usually, tabPanel contains a .contentfragment, so let's use that if present
      const cf = tabPanel.querySelector('.contentfragment, .cmp-contentfragment, article.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // Fallback: use all children of tabPanel, but filter out empty nodes or those with only whitespace
        const arr = Array.from(tabPanel.childNodes).filter(n => {
          if (n.nodeType === 1) return true;
          if (n.nodeType === 3 && n.textContent.trim()) return true;
          return false;
        });
        if (arr.length === 1) {
          content = arr[0];
        } else if (arr.length > 1) {
          content = arr;
        } else {
          content = tabPanel;
        }
      }
    }
    cells.push([label, content]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs block with the created table
  tabsBlock.replaceWith(block);
}
