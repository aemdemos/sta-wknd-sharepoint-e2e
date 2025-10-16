/* global WebImporter */
export default function parse(element, { document }) {
  // --- Extract sidebar content (title, details, sharing) ---
  const sidebarRows = [];
  // Title
  const titleEl = element.querySelector('.cmp-title__text');
  if (titleEl) {
    sidebarRows.push([titleEl.cloneNode(true)]);
  }
  // Details (contentfragment)
  const detailsFragment = element.querySelector('.cmp-contentfragment__elements');
  if (detailsFragment) {
    Array.from(detailsFragment.children).forEach(row => {
      if (row.classList && row.classList.contains('cmp-contentfragment__element')) {
        const dt = row.querySelector('dt');
        const dd = row.querySelector('dd');
        if (dt && dd) {
          const div = document.createElement('div');
          div.appendChild(dt.cloneNode(true));
          div.appendChild(dd.cloneNode(true));
          sidebarRows.push([div]);
        }
      }
    });
  }
  // Share this Adventure section
  const shareTitle = element.querySelector('.title .cmp-title__text');
  if (shareTitle && shareTitle.textContent.includes('Share this Adventure')) {
    sidebarRows.push([shareTitle.cloneNode(true)]);
    const sharingDiv = element.querySelector('.sharing');
    if (sharingDiv) {
      sidebarRows.push([sharingDiv.cloneNode(true)]);
    }
  }

  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements in tablist)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Prepare the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs22)']);

  // Add sidebar rows first
  sidebarRows.forEach(r => rows.push(r));

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i += 1) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let contentElements = Array.from(panel.childNodes);
    if (contentElements[0] && contentElements[0].nodeType === 1 && contentElements[0].tagName === 'H3') {
      contentElements = contentElements.slice(1);
    }
    if (contentElements.length === 1 && contentElements[0].classList && contentElements[0].classList.contains('contentfragment')) {
      const cf = contentElements[0];
      const cfElements = cf.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        let cfChildren = Array.from(cfElements.childNodes);
        if (cfChildren[0] && cfChildren[0].nodeType === 1 && cfChildren[0].tagName === 'H3') {
          cfChildren = cfChildren.slice(1);
        }
        if (cfChildren.length === 1 && cfChildren[0].tagName === 'DIV') {
          cfChildren = Array.from(cfChildren[0].childNodes);
        }
        cfChildren = cfChildren.filter(n => n.nodeType !== 3 || n.textContent.trim() !== '');
        contentElements = cfChildren.length ? cfChildren : [cfElements];
      } else {
        contentElements = [cf];
      }
    }
    contentElements = contentElements.filter(n => n.nodeType !== 3 || n.textContent.trim() !== '');
    if (contentElements.length === 1 && contentElements[0].tagName === 'DIV' && contentElements[0].childNodes.length > 0) {
      contentElements = Array.from(contentElements[0].childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim() !== '');
    }
    if (!contentElements.length) {
      contentElements = [panel];
    }
    rows.push([
      label,
      contentElements.length === 1 ? contentElements[0] : contentElements
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
