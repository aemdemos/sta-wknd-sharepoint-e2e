/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tablist (should be in order)
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tablist ? Array.from(tablist.children) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tab panels (these are in order of the tabs)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: if number of labels and panels not matching, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  tabPanels.forEach((panel, idx) => {
    // Find the main content fragment in the panel (usually a single article)
    const contentFragment = panel.querySelector('article');
    let contentCell = [];
    if (contentFragment) {
      // Try to take all direct children of .cmp-contentfragment__elements that are meaningful
      const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Collect only the children that are not just empty grid wrappers
        const children = Array.from(elements.children).filter(child => {
          // Exclude divs that are just aem-Grid wrappers with no meaningful content
          if (
            child.tagName === 'DIV' &&
            child.children.length === 1 &&
            child.firstElementChild &&
            child.firstElementChild.classList.contains('aem-Grid')
          ) {
            return false;
          }
          // Otherwise, include
          return true;
        });
        if (children.length) {
          contentCell = children;
        }
      }
      // If we didn't find anything, fallback to all elements inside .cmp-contentfragment__elements
      if (!contentCell.length && elements) {
        contentCell = Array.from(elements.children);
      }
    }
    // If still empty, fallback to all children of the panel
    if (!contentCell.length) {
      contentCell = Array.from(panel.children);
    }
    // If still empty, fallback to panel itself
    if (!contentCell.length) {
      contentCell = [panel];
    }
    rows.push([tabLabels[idx], contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
