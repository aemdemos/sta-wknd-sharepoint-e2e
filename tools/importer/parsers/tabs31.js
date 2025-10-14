/* global WebImporter */
export default function parse(element, { document }) {
  // --- Extract sidebar content (Activity, Adventure Type, etc) ---
  let sidebarRows = [];
  const sidebarFragment = element.querySelector('.cmp-container .cmp-contentfragment');
  if (sidebarFragment) {
    const titleEl = sidebarFragment.querySelector('.cmp-contentfragment__title');
    if (titleEl) {
      sidebarRows.push([titleEl.textContent.trim()]);
    }
    const dtEls = sidebarFragment.querySelectorAll('dt.cmp-contentfragment__element-title');
    const ddEls = sidebarFragment.querySelectorAll('dd.cmp-contentfragment__element-value');
    dtEls.forEach((dt, i) => {
      const dd = ddEls[i];
      if (dt && dd) {
        sidebarRows.push([`${dt.textContent.trim()}: ${dd.textContent.trim()}`]);
      }
    });
  }
  // Share this Adventure label and sharing buttons/links
  const shareTitle = element.querySelector('.title .cmp-title__text');
  if (shareTitle && shareTitle.textContent.trim().toLowerCase().includes('share')) {
    sidebarRows.push([shareTitle.textContent.trim()]);
    // Add sharing buttons/links if present
    const sharingDiv = element.querySelector('.sharing');
    if (sharingDiv) {
      // Facebook share button
      const fbShare = sharingDiv.querySelector('.fb-share-button');
      if (fbShare) {
        sidebarRows.push(['Facebook Share']);
      }
      // Pinterest share button
      const pinShare = sharingDiv.querySelector('a[data-pin-do="buttonPin"]');
      if (pinShare) {
        sidebarRows.push(['Pinterest Share']);
      }
    }
  }
  // Insert sidebar info as a table before the tabs block if any
  if (sidebarRows.length) {
    const sidebarTable = WebImporter.DOMUtils.createTable(sidebarRows, document);
    element.parentNode.insertBefore(sidebarTable, element);
  }

  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels (li elements in tablist)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build rows: first row is header
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((labelEl, idx) => {
    const labelText = labelEl.textContent.trim();
    let panelEl = tabPanels[idx];
    if (labelEl.hasAttribute('aria-controls')) {
      const panelId = labelEl.getAttribute('aria-controls');
      panelEl = cmpTabs.querySelector(`#${panelId}`) || panelEl;
    }
    if (!panelEl) return;
    const tabContentEls = [];
    Array.from(panelEl.childNodes).forEach((node) => {
      if (node.nodeType === 3 && !node.textContent.trim()) return;
      if (node.nodeType === 1 && node.tagName === 'DIV' && !node.textContent.trim() && node.querySelectorAll('img').length === 0) return;
      tabContentEls.push(node);
    });
    let tabContentCell = tabContentEls.length === 1 ? tabContentEls[0] : tabContentEls;
    rows.push([labelText, tabContentCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
