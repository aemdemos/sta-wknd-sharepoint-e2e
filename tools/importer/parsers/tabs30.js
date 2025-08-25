/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels in visual order
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get all tabpanels in order -- each should correspond to a tab label
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Table header, per requirements
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, extract the label and referenced content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent;

    // Try to reference the content fragment content area
    if (panel) {
      // Find main content area for tab content
      const contentfragment = panel.querySelector('.cmp-contentfragment');
      if (contentfragment) {
        // Look for .cmp-contentfragment__elements which contains all content
        const elements = contentfragment.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          tabContent = elements;
        } else {
          tabContent = contentfragment;
        }
      } else {
        // If no contentfragment, reference the panel itself
        tabContent = panel;
      }
    } else {
      // Defensive: If no panel, use blank span
      tabContent = document.createElement('span');
    }

    rows.push([label, tabContent]);
  }

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}
