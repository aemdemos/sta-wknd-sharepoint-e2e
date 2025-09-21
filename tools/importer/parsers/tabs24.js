/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (the tab container)
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs inside
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: tab labels and panels must match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Tabs (tabs24)'];
  rows.push(headerRow);

  // For each tab, build a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the panel content so we don't move it from the DOM
    // But, we want to preserve the visual structure as much as possible
    // We'll grab the direct children of the tabpanel div (skip the outer wrapper)
    // If the tabpanel has a single child (e.g. .contentfragment), use that
    // Otherwise, use all children
    let contentEls = [];
    // Remove aria-hidden panels from the DOM (they may be hidden)
    if (panel.hasAttribute('aria-hidden') && panel.getAttribute('aria-hidden') === 'true') {
      // But we still want their content
    }
    // Find the main content container inside the tabpanel
    // Usually it's a .contentfragment or similar
    const mainContent = panel.querySelector('article, .contentfragment, .cmp-contentfragment, .cmp-contentfragment__elements') || panel;
    // We'll use all children of mainContent
    contentEls = Array.from(mainContent.childNodes).filter(node => {
      // Skip empty text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      // Otherwise, keep all elements
      return true;
    });
    // If nothing found, fallback to the panel's children
    if (contentEls.length === 0) {
      contentEls = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
    }
    // Defensive: if still nothing, fallback to label only
    if (contentEls.length === 0) {
      contentEls = [document.createTextNode('')];
    }
    rows.push([label, contentEls]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
