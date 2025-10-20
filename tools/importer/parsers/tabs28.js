/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs;
  if (tabsContainer) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;
  }
  if (!cmpTabs) return;

  // Get tab labels (li elements inside tablist)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Tabs (tabs28)']);

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // For tab content, use the entire contentfragment/article inside the panel if present
    let tabContent;
    const contentFragment = panel.querySelector('.contentfragment, article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of panel
      tabContent = Array.from(panel.childNodes);
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block in the DOM
  tabsContainer.replaceWith(block);
}
