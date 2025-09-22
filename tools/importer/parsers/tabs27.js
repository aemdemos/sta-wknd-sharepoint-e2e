/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs.panelcontainer block (the one with the tabs)
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs, [class*="tabs"]');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tabs container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map((li) => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure the number of labels matches the number of panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const headerRow = ['Tabs (tabs27)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if no panel
    if (!panel) continue;

    // For content: grab the direct contentfragment/article inside the tabpanel
    let content = null;
    // Try to find a contentfragment/article or just use the tabpanel's children
    const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (cf) {
      content = cf;
    } else {
      // fallback: create a fragment with all children
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach((n) => frag.appendChild(n.cloneNode(true)));
      content = frag;
    }
    rows.push([label, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
