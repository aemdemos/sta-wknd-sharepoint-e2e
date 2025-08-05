/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in this section
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels - these are the visible tab titles
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));

  // Get tab panels - these are in order matching the tab labels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Header row: block name (exact from requirements)
  const cells = [["Tabs (tabs11)"]];

  // Each tab: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let contentElem = null;
    // If there is an article, use that (main content of tab)
    if (panel) {
      contentElem = panel.querySelector('article');
      // If no article, fall back to the whole tabPanel (in case tabPanel is the content itself)
      if (!contentElem) {
        // But avoid duplicating tab labels from ARIA attributes
        // Use all children except for scripts/styles
        const validChildren = Array.from(panel.childNodes).filter(node => {
          if (node.nodeType === 1) {
            // ELEMENT_NODE
            return node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE';
          } else if (node.nodeType === 3) {
            // TEXT_NODE
            return node.textContent.trim().length > 0;
          }
          return false;
        });
        // If there's just one valid child, use it directly, otherwise use all
        contentElem = validChildren.length === 1 ? validChildren[0] : validChildren;
      }
    } else {
      contentElem = document.createTextNode('');
    }
    // Push row: [tab label, content element(s)]
    cells.push([label, contentElem]);
  }

  // Create table using the extracted cells
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace only the tabs block (not parent, not siblings)
  tabsBlock.replaceWith(table);
}
