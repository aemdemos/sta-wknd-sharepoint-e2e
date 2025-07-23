/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get all tab panels in order
  // (they are direct children in source, in same order as tabs)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Compose the table rows: first row is header, then one row per tab
  const rows = [];
  rows.push(['Tabs (tabs23)']); // header row as required by spec/example

  for (let i = 0; i < tabLabelEls.length; i++) {
    // Get label text
    const label = tabLabelEls[i]?.textContent?.trim() || '';
    // Get panel element
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Each tab panel contains a .cmp-contentfragment
      const contentFragment = panel.querySelector('.cmp-contentfragment');
      if (contentFragment) {
        // The content is inside .cmp-contentfragment__elements
        const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          // Gather all direct children that are not empty grid wrappers
          const nodes = [];
          Array.from(elements.children).forEach(child => {
            // Exclude empty aem-Grid wrappers
            if (
              child.matches('div') &&
              child.querySelector('.aem-Grid') &&
              child.textContent.trim() === ''
            ) {
              return;
            }
            nodes.push(child);
          });
          if (nodes.length === 1) {
            content = nodes[0];
          } else if (nodes.length > 1) {
            content = nodes;
          } else {
            // fallback, use the entire .cmp-contentfragment__elements
            content = elements;
          }
        } else {
          // fallback, use all of contentFragment
          content = contentFragment;
        }
      } else {
        // fallback, use the panel as-is
        content = panel;
      }
    }
    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
