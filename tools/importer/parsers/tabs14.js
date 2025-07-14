/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: .cmp-tabs inside .tabs
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;
  
  // Get tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  if (!tabLabels.length) return;

  // Prepare header row
  const headerRow = ['Tabs (tabs14)'];

  // Each row after header: [Tab Label, Tab Content]
  const rows = tabLabels.map(label => {
    const labelText = label.textContent.trim();
    const panelId = label.getAttribute('aria-controls');
    const panel = tabsContainer.querySelector(`#${panelId}`);
    let mainContent = '';
    if (panel) {
      // Prefer the .contentfragment or .cmp-contentfragment element if present
      const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
      if (cf) {
        mainContent = cf;
      } else {
        // fallback: all panel children except empty .aem-Grid
        const panelChildren = Array.from(panel.children).filter(ch => {
          if (ch.classList && ch.classList.contains('aem-Grid')) {
            return ch.textContent.trim().length > 0;
          }
          return true;
        });
        if (panelChildren.length === 1) mainContent = panelChildren[0];
        else if (panelChildren.length > 1) mainContent = panelChildren;
        else mainContent = panel;
      }
    }
    return [labelText, mainContent];
  });

  // Compose the final cells array
  const cells = [
    headerRow,
    ...rows
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsContainer.replaceWith(block);
}
