/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Locate the cmp-tabs inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels in order
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels in order
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs32)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Find the main content fragment inside the tab panel
    let tabContent = null;
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      // Use the contentfragment's children except the h3 title (if present)
      // (We want the visible content, not the repeated h3)
      const fragment = document.createElement('div');
      Array.from(cf.children).forEach(child => {
        if (!child.classList.contains('cmp-contentfragment__title')) {
          fragment.appendChild(child.cloneNode(true));
        }
      });
      tabContent = fragment;
    } else {
      // If no contentfragment, use the panel's children
      const fragment = document.createElement('div');
      Array.from(panel.children).forEach(child => {
        fragment.appendChild(child.cloneNode(true));
      });
      tabContent = fragment;
    }

    // Remove empty wrappers
    if (tabContent.childNodes.length === 1 && tabContent.firstChild.nodeType === 1) {
      tabContent = tabContent.firstChild;
    }

    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
