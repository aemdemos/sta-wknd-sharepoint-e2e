/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get Tab Labels
  const tabLabels = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }
  
  // Get Tab Panels (in DOM order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));
  
  // Compose rows for the block table
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];
  
  // For each label, pair it with the panel content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Find all direct children elements of the tabpanel (ignoring empty grid wrappers)
      const children = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip grid wrappers that are empty
          if (node.classList.contains('aem-Grid') && node.childElementCount === 0) {
            return false;
          }
          return true;
        }
        // Skip empty text nodes
        return false;
      });
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // fallback: panel innerText
        contentCell = panel.textContent.trim();
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the cmp-tabs block with the new table
  tabsBlock.replaceWith(table);
}
