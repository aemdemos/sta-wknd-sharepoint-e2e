/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual tabs block (div with class 'cmp-tabs')
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist (the <li> with role="tab")
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];

  // Build the header row as per block name
  const headerRow = ['Tabs (tabs12)'];

  // Compose the rows: each [Tab Label (string), Tab Content (existing element(s))]
  const rows = [];
  for (let i = 0; i < tabLabelEls.length; i++) {
    const labelEl = tabLabelEls[i];
    const tabLabel = labelEl.textContent.trim();
    // Find tabpanel by aria-controls
    const controls = labelEl.getAttribute('aria-controls');
    let contentEl = controls ? tabsBlock.querySelector(`#${controls}`) : null;
    // If not found by id, fallback to nth tabpanel div
    if (!contentEl) {
      const allPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
      contentEl = allPanels[i];
    }
    let tabContent = '';
    if (contentEl) {
      // If tabpanel contains a main contentfragment article, use it directly
      const mainFragment = contentEl.querySelector('article.cmp-contentfragment');
      if (mainFragment) {
        tabContent = mainFragment;
      } else {
        // Otherwise, collect all children in the panel
        const children = Array.from(contentEl.childNodes).filter(n => {
          // skip whitespace-only text nodes
          return !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim());
        });
        if (children.length === 1) {
          tabContent = children[0];
        } else if (children.length > 1) {
          tabContent = children;
        } else {
          tabContent = '';
        }
      }
    }
    rows.push([tabLabel, tabContent]);
  }

  // Compose the final block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the generated table
  tabsBlock.replaceWith(table);
}
