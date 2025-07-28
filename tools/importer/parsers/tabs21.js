/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 2. Get tab labels (as in the .cmp-tabs__tablist > li structure)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li'));

  // 3. Get tab content panels (in order)
  // Each has data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: handle mismatch or missing tabs
  if (tabLabelEls.length === 0 || tabPanels.length === 0) return;

  // 4. Build header row for block table
  // Must match exactly the block name in the brief
  const cells = [["Tabs (tabs21)"]];

  // 5. Each subsequent row is [Tab Label, Tab Content], referencing existing elements
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i].textContent.trim();
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // We want the content INSIDE the tabpanel, not the panel div itself
      // Usually there's one .contentfragment child, which we want to use as is
      const tabPanelContentChildren = Array.from(panel.children).filter(el => {
        // Only keep visible/meaningful elements
        return el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE';
      });
      if (tabPanelContentChildren.length === 1) {
        content = tabPanelContentChildren[0];
      } else if (tabPanelContentChildren.length > 1) {
        content = tabPanelContentChildren;
      } else {
        // Fallback: if nothing, use empty string
        content = '';
      }
    }
    cells.push([label, content]);
  }

  // 6. Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 7. Replace the original cmp-tabs element only (keep siblings intact)
  tabsRoot.replaceWith(block);
}
