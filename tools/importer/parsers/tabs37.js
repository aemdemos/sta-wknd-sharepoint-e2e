/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the cmp-tabs__tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const labelEls = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = labelEls.map(li => li.textContent.trim());

  // Get the tab panels (tabpanel role)
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Header row as per example: single column, exact text
  const headerRow = ['Tabs (tabs37)'];

  // Each row: [tab label, tab content]
  const rows = tabLabels.map((label, idx) => {
    // Reference the existing label as text (not strong, to match example – strong is for styling only)
    // But if the example has <strong> or not does not matter for semantics here.
    // Use a <span> for safe referencing
    const labelEl = document.createElement('span');
    labelEl.textContent = label;

    // Each tab panel: use the main content node, which is typically the article/contentfragment inside the tabpanel
    const panel = tabPanels[idx];
    let contentEl;
    if (panel) {
      // Find the main content block (e.g. article, .contentfragment), otherwise fallback to panel
      const mainBlock = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment') || panel;
      // Use the mainBlock directly if it is a child, else wrap all panel content in a fragment
      if (panel.children.length === 1 && panel.children[0] === mainBlock) {
        contentEl = mainBlock;
      } else {
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(node => frag.appendChild(node));
        contentEl = frag;
      }
    } else {
      contentEl = document.createTextNode('');
    }
    return [labelEl, contentEl];
  });

  // Compose the final table: first row is header (single col), then each [label, content] row (2 cols)
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
