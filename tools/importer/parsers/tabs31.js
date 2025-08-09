/* global WebImporter */
export default function parse(element, { document }) {
  // Locate only the tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get the tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the block header row
  const headerRow = ['Tabs (tabs31)'];

  // Compose rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel) => {
    const label = tabLabel.textContent.trim();
    // Panel id from aria-controls
    const tabPanelId = tabLabel.getAttribute('aria-controls');
    const panel = tabPanelId ? tabsBlock.querySelector(`#${tabPanelId}`) : null;
    let tabContent = '';
    if (panel) {
      // Find the core content in the panel
      // Grab the first contentfragment/article if present, otherwise the panel
      let contentBlock = panel.querySelector('article') || panel;
      // Collect all ELEMENT children of the content block
      const fragment = document.createDocumentFragment();
      Array.from(contentBlock.children).forEach(child => {
        fragment.appendChild(child);
      });
      // Use the fragment if it contains nodes, else fallback to contentBlock
      tabContent = fragment.childNodes.length ? fragment : contentBlock;
    }
    return [label, tabContent];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block only
  tabsBlock.parentElement.replaceChild(block, tabsBlock);
}
