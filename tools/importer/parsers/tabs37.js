/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels (content)
  const panels = tabsBlock.querySelectorAll('[role="tabpanel"]');
  const cells = [['Tabs (tabs37)']];

  // Defensive: Ensure we have the same number of tab labels and panels
  const numTabs = Math.max(tabLabels.length, panels.length);
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i] || '';
    const panel = panels[i];
    let tabContent;
    if (panel) {
      // Use the panel's actual content node reference if safe, otherwise create a wrapper
      // To avoid moving nodes out of the DOM, use an array of child elements for the cell
      // (don't clone to ensure referencing existing elements as requested)
      const contentChildren = Array.from(panel.childNodes).filter(n => (
        n.nodeType !== Node.TEXT_NODE || n.textContent.trim().length > 0 || n.nodeValue === '\n'
      ));
      tabContent = contentChildren.length === 1 ? contentChildren[0] : contentChildren;
    } else {
      tabContent = '';
    }
    cells.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block itself with the table
  tabsBlock.replaceWith(table);
}
