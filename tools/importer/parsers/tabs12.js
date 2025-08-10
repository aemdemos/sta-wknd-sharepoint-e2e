/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Build the table rows
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabelEls.length; i++) {
    const labelEl = tabLabelEls[i];
    const label = labelEl.textContent.trim();

    // Find the corresponding panel. The tab's aria-controls attribute gives the panel id
    const panelId = labelEl.getAttribute('aria-controls');
    let panel = null;
    if (panelId) {
      panel = tabsBlock.querySelector(`#${panelId}`);
    }
    // Fallback: just match order
    if (!panel && tabPanels[i]) {
      panel = tabPanels[i];
    }

    // For tab label cell, create a <strong> element for visual parity with the example
    const strong = document.createElement('strong');
    strong.textContent = label;

    // For tab content cell, reference the direct children of the tabpanel (e.g., contentfragment/article)
    let contentCell = null;
    if (panel) {
      // If the panel has only one main content element, use that element
      const mainChildren = Array.from(panel.children).filter(e => e.nodeType === 1 && (e.textContent.trim() !== '' || e.querySelector('img,ul,ol,li,p,h1,h2,h3,h4,h5,h6')));
      if (mainChildren.length === 1) {
        contentCell = mainChildren[0];
      } else if (mainChildren.length > 1) {
        contentCell = mainChildren;
      } else {
        // If panel has no children, fallback to using its text content as a text node
        contentCell = panel.textContent.trim();
      }
    } else {
      contentCell = '';
    }
    rows.push([strong, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
