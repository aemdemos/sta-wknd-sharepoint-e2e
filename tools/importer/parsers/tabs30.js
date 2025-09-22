/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Extract tab panels (content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Always use the target block name as the header row
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the contentfragment inside the panel
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Clone to avoid modifying source
      const fragClone = contentFragment.cloneNode(true);
      // Remove the tab title (h3) if present
      const h3 = fragClone.querySelector('.cmp-contentfragment__title');
      if (h3) h3.remove();
      // Collect all child nodes except empty text nodes
      const children = Array.from(fragClone.childNodes).filter(
        node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0
      );
      // If only one element, use it directly
      tabContent = children.length === 1 ? children[0] : children;
    } else {
      // fallback: use all children of the panel
      const children = Array.from(panel.childNodes).filter(
        node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0
      );
      tabContent = children.length === 1 ? children[0] : children;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
