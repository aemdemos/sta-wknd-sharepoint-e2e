/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Get the cmp-tabs element
  const cmpTabs = tabsContainer.classList.contains('cmp-tabs') ? tabsContainer : tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from ol.cmp-tabs__tablist > li
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels by role="tabpanel"
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Build the header row: block name exactly as required
  const cells = [['Tabs (tabs10)']];

  // For each tab, extract its label and content fragment
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i].textContent.trim();
    // Find panel by aria-labelledby
    const tabId = tabLabels[i].getAttribute('id');
    let panel = tabPanels.find(tp => tp.getAttribute('aria-labelledby') === tabId);
    if (!panel) {
      // fallback by order if attribute missing
      panel = tabPanels[i];
    }
    let tabContent = null;
    if (panel) {
      // Content is the direct .contentfragment inside this panel, or panel itself if not present
      const cFrag = panel.querySelector('.contentfragment');
      tabContent = cFrag ? cFrag : panel;
    } else {
      tabContent = document.createTextNode('');
    }
    cells.push([tabLabel, tabContent]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
