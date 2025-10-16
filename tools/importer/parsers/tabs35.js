/* global WebImporter */

export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tab navigation and tab panels
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Tab headers
  const tabHeaders = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only process if headers and panels match
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabHeaders.forEach((tabHeader, idx) => {
    // Tab label (text)
    const tabLabel = tabHeader.textContent.trim();

    // Tab content panel
    const panel = tabPanels[idx];
    if (!panel) return;

    // Get the actual content fragment inside the panel
    let tabContent = null;
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      // Remove the h3 title if present
      const cfClone = cf.cloneNode(true);
      const h3 = cfClone.querySelector('h3.cmp-contentfragment__title');
      if (h3) h3.remove();
      // Only keep meaningful children (no empty grid wrappers)
      tabContent = Array.from(cfClone.children).filter(child => {
        // Remove empty grid wrappers and divs with no content
        if (child.matches('.aem-Grid, .aem-GridColumn')) return false;
        if (child.textContent.trim() === '' && !child.querySelector('img, ul, ol')) return false;
        return true;
      });
      // If nothing left, fallback to cfClone itself
      if (!tabContent.length) tabContent = [cfClone];
    } else {
      // Fallback: use panel's children, but filter out empty grid wrappers
      tabContent = Array.from(panel.children).filter(child => {
        if (child.matches('.aem-Grid, .aem-GridColumn')) return false;
        if (child.textContent.trim() === '' && !child.querySelector('img, ul, ol')) return false;
        return true;
      });
      if (!tabContent.length) tabContent = [panel];
    }

    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
