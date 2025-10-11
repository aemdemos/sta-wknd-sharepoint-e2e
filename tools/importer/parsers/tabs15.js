/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (by class or role)
  const tabsContainer = element.querySelector('.cmp-tabs, .tabs, .panelcontainer');
  if (!tabsContainer) return;

  // Find the tab navigation (the list of tab labels)
  const tabList = tabsContainer.querySelector('[role="tablist"], .cmp-tabs__tablist, ol');
  if (!tabList) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"], .cmp-tabs__tab, li'));

  // Find all tab panels (content areas)
  // Panels may be divs with role="tabpanel" or .cmp-tabs__tabpanel
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel'));
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Defensive: Only map as many panels as there are labels
  const rows = [];
  for (let i = 0; i < Math.min(tabLabels.length, tabPanels.length); i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // For tab content, grab all direct children of the tab panel
    // If there's only one child, use it directly; otherwise, use an array
    let content = [];
    // Defensive: Some tab panels wrap content in a single contentfragment/article
    // Use all children except empty grid divs
    const children = Array.from(panel.children).filter((child) => {
      // Filter out empty grid divs
      if (child.classList.contains('aem-Grid')) return false;
      if (child.tagName === 'DIV' && child.children.length === 0 && child.textContent.trim() === '') return false;
      return true;
    });
    if (children.length === 1) {
      // If the only child is a contentfragment/article, use its children
      const only = children[0];
      if (only.tagName === 'ARTICLE' || only.classList.contains('cmp-contentfragment')) {
        // Use all children of the article except empty grid divs
        content = Array.from(only.children).filter((child) => {
          if (child.classList.contains('aem-Grid')) return false;
          if (child.tagName === 'DIV' && child.children.length === 0 && child.textContent.trim() === '') return false;
          return true;
        });
      } else {
        content = [only];
      }
    } else {
      content = children;
    }
    // If content is empty, fallback to panel itself
    if (content.length === 0) content = [panel];
    rows.push([label, content]);
  }

  // Table header
  const headerRow = ['Tabs (tabs15)'];
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
