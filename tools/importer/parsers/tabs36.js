/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract all tab labels from tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('[role="tab"]'));

  // Extract all tab panels (one per tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Create the table header row as in the example
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // Each row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i] && tabLabels[i].textContent ? tabLabels[i].textContent.trim() : '';

    // Find the correct tab panel for this tab label
    let panel = null;
    const ariaControls = tabLabels[i] && tabLabels[i].getAttribute('aria-controls');
    if (ariaControls) {
      panel = tabsBlock.querySelector(`#${ariaControls}`);
    }
    if (!panel) {
      // Fallback: use nth tabPanel
      panel = tabPanels[i];
    }
    if (!panel) {
      // If no panel, use empty cell
      rows.push([tabLabel, '']);
      continue;
    }

    // Get the content for the tab: use first .contentfragment inside panel if available, else all panel content
    let tabContent = panel.querySelector('.contentfragment');
    if (!tabContent) {
      // Fallback: Use the direct children of panel (to avoid copying tab wrapper div)
      const children = Array.from(panel.childNodes).filter(n => {
        // Remove empty text nodes or blank div wrappers
        if (n.nodeType === 3 && n.textContent.trim() === '') return false;
        if (n.nodeType === 1 && n.tagName === 'DIV' && n.innerHTML.trim() === '') return false;
        return true;
      });
      if (children.length === 1) {
        tabContent = children[0];
      } else if (children.length > 1) {
        // Wrap in a div for multiple nodes
        const wrapper = document.createElement('div');
        children.forEach(child => wrapper.appendChild(child));
        tabContent = wrapper;
      } else {
        tabContent = '';
      }
    }

    rows.push([tabLabel, tabContent]);
  }

  // Create the block table using the required helper
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with our new table
  tabsBlock.replaceWith(table);
}
