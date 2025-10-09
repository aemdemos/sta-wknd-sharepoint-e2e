/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsRoot;
  if (tabsContainer && tabsContainer.classList.contains('cmp-tabs')) {
    // tabsContainer is the actual tabs root
    tabsRoot = tabsContainer;
  } else if (tabsContainer) {
    // tabsContainer contains the tabs root
    tabsRoot = tabsContainer.querySelector('.cmp-tabs');
  }
  if (!tabsRoot) return;

  // Get tab titles from the tab navigation
  const tabTitles = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: If tabTitles and tabPanels mismatch, bail
  if (tabTitles.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs38)']);

  // Each tab: [Tab Label, Tab Content]
  tabTitles.forEach((title, i) => {
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) return;

    // For robustness, reference the entire tab panel content
    // Remove aria attributes and classes that are not needed
    const tabContent = document.createElement('div');
    // Copy all children from the panel
    Array.from(panel.childNodes).forEach(child => {
      tabContent.appendChild(child.cloneNode(true));
    });
    rows.push([title, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block in the DOM
  tabsContainer.replaceWith(block);
}
