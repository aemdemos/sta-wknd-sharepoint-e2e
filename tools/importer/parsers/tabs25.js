/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs inside the tabs container
  const cmpTabs = tabsRoot.classList.contains('cmp-tabs') ? tabsRoot : tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements in the tablist)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only proceed if we have at least one tab and panel
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs25)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find the panel by aria-labelledby
    const tabId = tabLabels[i].getAttribute('id');
    const panel = tabPanels.find(panelEl => {
      return panelEl.getAttribute('aria-labelledby') === tabId;
    });
    if (!panel) continue;
    // For content, grab all children of the tabpanel
    const frag = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(node => {
      frag.appendChild(node.cloneNode(true));
    });
    rows.push([label, frag]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
