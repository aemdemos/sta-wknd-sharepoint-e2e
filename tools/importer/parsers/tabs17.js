/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs cmp-tabs element within this block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (!tabLabels.length) return;

  // Get all tab panels (content), order should correspond to labels
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  if (!tabPanels.length) return;

  // Prepare header row for the block table
  const headerRow = ['Tabs (tabs17)'];
  const rows = [headerRow];

  // Create a row for each tab: [label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let panelContent;
    if (panel) {
      // Collect all meaningful nodes (skip empty aem-Grid and whitespace)
      const contentNodes = [];
      for (const node of panel.childNodes) {
        if ((node.nodeType === Node.ELEMENT_NODE &&
              node.classList.contains('aem-Grid') &&
              node.childElementCount === 0) ||
            (node.nodeType === Node.ELEMENT_NODE &&
              node.tagName === 'DIV' && node.innerHTML.trim() === '' && node.childElementCount === 0)) {
          continue;
        }
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') continue;
        contentNodes.push(node);
      }
      if (!contentNodes.length) {
        panelContent = panel;
      } else if (contentNodes.length === 1) {
        panelContent = contentNodes[0];
      } else {
        panelContent = contentNodes;
      }
    } else {
      panelContent = '';
    }
    rows.push([label, panelContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the cmp-tabs element with the block table
  tabs.parentNode.replaceChild(block, tabs);
}
