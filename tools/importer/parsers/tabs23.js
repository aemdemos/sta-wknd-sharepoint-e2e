/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab label elements in order
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels in order as they appear in HTML
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row with block name exactly as per spec
  const rows = [['Tabs (tabs23)']];

  // Each row represents a tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // The content of the tab is everything inside the panel
      // Reference all children elements, preserving their structure
      const children = Array.from(panel.childNodes).filter(
        n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
      );
      if (children.length === 1) {
        content = children[0];
      } else if (children.length > 1) {
        // Put multiple children in a fragment
        const frag = document.createDocumentFragment();
        children.forEach(node => frag.appendChild(node));
        content = frag;
      } else {
        // If for some reason the panel is empty
        content = '';
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the table using the provided DOM utils
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
