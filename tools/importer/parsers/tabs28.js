/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from the tablist
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // For each tab, find the corresponding tabpanel and content
  // We will keep the order from the tabLabels
  const rows = tabLabels.map((tabLabel, idx) => {
    const tabEl = tabLabelEls[idx];
    let tabPanel = null;
    if (tabEl && tabEl.hasAttribute('aria-controls')) {
      const controlsId = tabEl.getAttribute('aria-controls');
      tabPanel = tabsEl.querySelector(`#${controlsId}`);
    }
    if (!tabPanel) {
      // fallback to order if aria-controls fails
      const allPanels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tabpanel'));
      tabPanel = allPanels[idx];
    }
    if (!tabPanel) {
      // fallback: blank cell
      return [tabLabel, document.createTextNode('')];
    }
    // Tab content: grab just the main content under .cmp-contentfragment__elements, or fallback to the whole tabPanel
    let tabContent = null;
    const mainContent = tabPanel.querySelector('.cmp-contentfragment__elements');
    if (mainContent) {
      tabContent = mainContent;
    } else {
      // fallback: use everything in tabPanel except the tab label/title
      // Remove the .cmp-contentfragment__title if present
      tabContent = tabPanel.cloneNode(true);
      const title = tabContent.querySelector('.cmp-contentfragment__title');
      if (title) title.remove();
    }
    return [tabLabel, tabContent];
  });

  // Construct the table cells as per the Tabs block requirements
  const cells = [
    ['Tabs (tabs28)'],
    ...rows
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
