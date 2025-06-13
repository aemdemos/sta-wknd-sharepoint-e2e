/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the given element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from the tabs list
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(label => label.textContent.trim());

  // Get all tabpanels (in order of appearance)
  const tabPanels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabPanels.length !== tabLabels.length) return; // Defensive check

  // Build the table rows
  // First row: header row, single cell
  const headerRow = ['Tabs (tabs36)'];

  // Each subsequent row: [tab label, tab content]
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // Gather the content for this tab
    const panel = tabPanels[i];
    let contentNodes = [];
    // Find contentfragment inside this panel
    const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (cf) {
      const mainContent = cf.querySelector('.cmp-contentfragment__elements');
      if (mainContent) {
        // Flatten: get all children that aren't empty grid wrappers
        Array.from(mainContent.children).forEach(child => {
          if (child.classList && child.classList.contains('aem-Grid')) return;
          // If it's a div that itself has a <ul> or <p> etc, descend
          if (child.children.length === 1 && (child.firstElementChild.tagName === 'UL' || child.firstElementChild.tagName === 'P' || child.firstElementChild.tagName === 'H2')) {
            Array.from(child.children).forEach(grandchild => contentNodes.push(grandchild));
          } else {
            contentNodes.push(child);
          }
        });
      }
    }
    // If we didn't find any content nodes, fallback to the panel's direct children
    if (contentNodes.length === 0) {
      Array.from(panel.children).forEach(child => contentNodes.push(child));
    }
    // If still nothing, fallback to the whole panel
    if (contentNodes.length === 0) {
      contentNodes = [panel];
    }
    rows.push([tabLabels[i], contentNodes]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
