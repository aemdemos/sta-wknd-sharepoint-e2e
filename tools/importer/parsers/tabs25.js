/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs container (for tab headers and panels)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Tab headers (li elements)
  const tabHeaders = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Tab panels (divs with role="tabpanel") - order matches tab headers
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));
  if (tabHeaders.length === 0 || tabPanels.length === 0 || tabHeaders.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabHeaders.forEach((tabHeader, idx) => {
    const label = tabHeader.textContent.trim();
    const panel = tabPanels[idx];
    if (!panel) return;
    // Extract main content fragment inside the panel
    let contentCell;
    const contentFragment = panel.querySelector('.contentfragment, article, .cmp-contentfragment__elements');
    if (contentFragment) {
      // Fix: preserve anchor links in related trips
      Array.from(contentFragment.querySelectorAll('li')).forEach(li => {
        const a = li.querySelector('a');
        if (a) {
          li.textContent = '';
          li.appendChild(a.cloneNode(true));
        }
      });
      contentCell = contentFragment.cloneNode(true);
    } else {
      contentCell = panel.cloneNode(true);
    }
    rows.push([
      label,
      contentCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
