/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block. It should have class 'cmp-tabs'.
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements inside .cmp-tabs__tablist)
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li'));

  // Get all tab panels (divs with class cmp-tabs__tabpanel)
  // These are ordered the same as tabLabels, even if not visually displayed
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows
  const rows = [];
  // Header row (EXACT as required)
  rows.push(['Tabs (tabs13)']);

  // Now build the tab label/content rows
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const tabPanel = tabPanels[i];
    let panelContent = null;
    if (tabPanel) {
      // Reference the first .contentfragment/article for content, or fallback to all children of tabPanel
      const contentFragment = tabPanel.querySelector('.contentfragment');
      if (contentFragment) {
        panelContent = contentFragment;
      } else {
        // Use a fragment containing all tabPanel's children
        const frag = document.createDocumentFragment();
        Array.from(tabPanel.childNodes).forEach(node => frag.appendChild(node));
        panelContent = frag;
      }
    } else {
      panelContent = document.createTextNode('');
    }
    rows.push([label, panelContent]);
  }

  // Create the table and replace the cmpTabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  cmpTabs.replaceWith(table);
}
