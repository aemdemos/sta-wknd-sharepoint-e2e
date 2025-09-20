/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the actual tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels (li elements)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    const tabLabel = labelEl.textContent.trim();
    const panelEl = tabPanels[i];
    // Find the main content inside the tab panel
    // If there's a single wrapper, use it; else, use all children
    let tabContent;
    if (panelEl.children.length === 1) {
      tabContent = panelEl.children[0];
    } else {
      // Use a DocumentFragment to preserve all content
      const frag = document.createDocumentFragment();
      Array.from(panelEl.childNodes).forEach(n => {
        if (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())) {
          frag.appendChild(n);
        }
      });
      tabContent = frag;
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
