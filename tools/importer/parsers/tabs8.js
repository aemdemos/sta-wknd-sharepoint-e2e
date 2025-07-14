/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (.cmp-tabs) inside .tabs or at root
  let tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) {
    const wrapper = element.querySelector('.tabs.panelcontainer');
    if (wrapper) {
      tabsBlock = wrapper.querySelector('.cmp-tabs');
    }
  }
  if (!tabsBlock) return;

  // Get all tab labels (in order)
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabelEls = Array.from(tablist.querySelectorAll('[role="tab"]'));
  if (!tabLabelEls.length) return;
  const tabLabels = tabLabelEls.map(el => el.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Build table rows: first row is single header, rest are [tab label, tab content]
  const rows = [['Tabs (tabs8)']];
  
  tabLabels.forEach((label, i) => {
    let contentCell = '';
    if (tabPanels[i]) {
      // Use .contentfragment inside the tabPanel, or the panel itself
      const cf = tabPanels[i].querySelector('.contentfragment') || tabPanels[i];
      // Remove h3.cmp-contentfragment__title if present and direct child
      const h3 = cf.querySelector('h3.cmp-contentfragment__title');
      if (h3 && h3.parentElement === cf) h3.remove();
      // Remove empty utility grid wrappers
      cf.querySelectorAll('.aem-Grid, .aem-GridColumn').forEach(grd => {
        if (!grd.textContent.trim() && grd.childElementCount === 0) grd.remove();
      });
      // Remove empty divs (if truly empty)
      cf.querySelectorAll('div').forEach(div => {
        if (!div.textContent.trim() && div.childElementCount === 0) div.remove();
      });
      // Reference all children (nodes) of cf
      const nodes = Array.from(cf.childNodes).filter(n => {
        if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim();
        if (n.nodeType === Node.ELEMENT_NODE) return true;
        return false;
      });
      contentCell = nodes.length > 1 ? nodes : (nodes[0] || '');
    }
    rows.push([label, contentCell]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace whole tabs block (prefer .tabs.panelcontainer wrapper, else cmp-tabs)
  const replaceTarget = tabsBlock.closest('.tabs.panelcontainer') || tabsBlock;
  replaceTarget.replaceWith(table);
}
