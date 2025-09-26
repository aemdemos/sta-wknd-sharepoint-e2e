/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: If no tabs or panels, do nothing
  if (!tabLabels.length || !tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Always use the required header
  const headerRow = ['Tabs (tabs34)'];
  rows.push(headerRow);

  // For each tab, find its label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find the corresponding panel (by order)
    const panel = tabPanels[i];
    if (!panel) continue;

    // The tab content is everything inside the tabpanel
    // We'll use the .contentfragment inside the panel as the content root
    let contentRoot = panel.querySelector('.contentfragment');
    if (!contentRoot) {
      // fallback: use the panel itself
      contentRoot = panel;
    }

    // Defensive: collect all children of contentRoot
    const contentNodes = Array.from(contentRoot.childNodes).filter(node => {
      // Remove empty text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });

    // If only one element, use it directly, else use an array
    let tabContent;
    if (contentNodes.length === 1) {
      tabContent = contentNodes[0];
    } else {
      tabContent = contentNodes;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
