/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab label <li>s
  const tabLabelEls = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // For each label, get its text and corresponding panel
  // Panels are in order in the DOM and have data-cmp-hook-tabs="tabpanel"
  const tabPanelEls = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row
  const headerRow = ['Tabs (tabs38)'];

  // Compose rows: [Tab Label, Tab Content (referencing the original content)]
  const rows = tabLabelEls.map((labelEl, i) => {
    // Tab label (always string)
    const label = labelEl.textContent.trim();
    // Tab content: use the full content of the panel
    // Reference the main content element within the tab panel to preserve structure
    const panel = tabPanelEls[i];
    let content = '';
    if (panel) {
      // Try to find a main content element inside the tabpanel
      let mainContent = null;
      // Prefer contentfragment/article, fallback to first div, fallback to panel itself
      mainContent = panel.querySelector('article, div.contentfragment, div.cmp-contentfragment__elements');
      if (!mainContent) {
        // fallback to the first direct child which is not a script or style
        mainContent = Array.from(panel.children).find(el => el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE');
      }
      if (!mainContent) {
        mainContent = panel;
      }
      content = mainContent;
    }
    return [label, content];
  });

  // Compose the cells array
  const cells = [headerRow, ...rows];

  // Create the block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs element with the new block table
  tabs.replaceWith(block);
}
