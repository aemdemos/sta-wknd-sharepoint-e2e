/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container within the element
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs;
  if (tabsContainer) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;
  }
  if (!cmpTabs) return;

  // Get tab labels (tab headers)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (tab content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Find the main content fragment inside the panel
    const cf = panel.querySelector('article.cmp-contentfragment') || panel;

    // For tab content, grab all direct children except the title (if present)
    // We'll collect the content in an array
    let tabContent = [];
    // Try to find the main content container inside the contentfragment
    const cfElements = cf.querySelector('.cmp-contentfragment__elements') || cf;
    // Get all direct children that are not empty grids or titles
    Array.from(cfElements.children).forEach(child => {
      // Ignore empty grid wrappers
      if (child.classList.contains('aem-Grid')) return;
      // Ignore h3 titles (they repeat the tab label)
      if (child.tagName === 'H3') return;
      // If the child is a wrapper, descend one level
      if (child.children.length === 1 && child.firstElementChild && child.firstElementChild.classList.contains('aem-Grid')) return;
      // If the child is a wrapper with content, descend
      if (child.children.length === 1 && child.firstElementChild && child.firstElementChild.tagName === 'DIV' && child.firstElementChild.children.length) {
        Array.from(child.firstElementChild.children).forEach(grandChild => {
          if (grandChild.classList.contains('aem-Grid')) return;
          tabContent.push(grandChild);
        });
      } else {
        tabContent.push(child);
      }
    });
    // Defensive: If no content found, fallback to the panel itself
    if (!tabContent.length) tabContent = [cfElements];

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the block table
  cmpTabs.replaceWith(block);
}
