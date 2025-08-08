/* global WebImporter */
export default function parse(element, { document }) {
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    tabs.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build table rows, starting with header row: one column only
  const rows = [];
  rows.push(['Tabs (tabs30)']);

  // All subsequent rows must be two columns: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Find .contentfragment or .cmp-contentfragment inside panel
      let mainContent = panel.querySelector('.contentfragment, .cmp-contentfragment');
      if (!mainContent) {
        // fallback: use the entire panel
        mainContent = panel;
      }

      // Remove empty grid filler elements
      Array.from(mainContent.querySelectorAll('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12')).forEach(e => e.remove());
      Array.from(mainContent.querySelectorAll('div')).forEach(div => {
        if (div.childNodes.length === 0 && div.textContent.trim() === '') div.remove();
      });

      content = mainContent;
    }
    rows.push([label, content]);
  }

  // Create table:
  //  - Header row: single column
  //  - Content rows: two columns
  // This causes first <tr> to have one <th>, and all subsequent <tr>s to have two <td>s
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace tabs element with block table
  tabs.replaceWith(block);
}
