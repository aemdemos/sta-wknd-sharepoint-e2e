/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (li elements with role="tab")
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  // Tab labels in order
  const tabLabels = tabLis.map(li => li.textContent.trim());

  // Get the tab panels in order as they appear in the DOM
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare rows: header and then one row per tab
  const rows = [['Tabs (tabs32)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Find the corresponding panel for this tab using aria-controls
    const li = tabLis[i];
    let tabPanelId = li.getAttribute('aria-controls');
    let panel = tabPanelId ? tabs.querySelector(`#${tabPanelId}`) : tabPanels[i];
    if (!panel) {
      // fallback: skip if can't find panel
      continue;
    }
    // Collect all content from the panel
    // We want to reference panel's direct content (not clone)
    // Typically, there is a .contentfragment as the direct child
    // But we reference the entire panel's children for robustness
    const contentNodes = Array.from(panel.childNodes).filter(
      node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
    );
    let cellContent;
    if (contentNodes.length === 1) {
      cellContent = contentNodes[0];
    } else if (contentNodes.length > 1) {
      cellContent = contentNodes;
    } else {
      cellContent = '';
    }
    rows.push([label, cellContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new block table
  tabs.replaceWith(block);
}
