/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist, [role="tablist"]');
  const tabLabels = Array.from(tabList ? tabList.children : []).filter(li => li.getAttribute('role') === 'tab');

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel'));

  if (!tabLabels.length || !tabPanels.length) return;

  const rows = [];
  rows.push(['Tabs (tabs36)']);

  tabLabels.forEach((tabLabel, i) => {
    const labelText = tabLabel.textContent.trim();
    let panel = null;
    const panelId = tabLabel.getAttribute('aria-controls');
    if (panelId) {
      panel = cmpTabs.querySelector(`#${panelId}`);
    }
    if (!panel) {
      panel = tabPanels[i];
    }
    if (!panel) return;

    // Extract only the relevant tab content: image, caption, and main text/list
    let cellContent = document.createElement('div');
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      // For Overview and Itinerary: get image, caption, and paragraphs
      const img = cf.querySelector('img');
      if (img) cellContent.appendChild(img.cloneNode(true));
      const caption = cf.querySelector('.cmp-image__title');
      if (caption) cellContent.appendChild(caption.cloneNode(true));
      // Get main text: paragraph(s) or list(s)
      const paragraphs = cf.querySelectorAll('p');
      paragraphs.forEach(p => cellContent.appendChild(p.cloneNode(true)));
      const lists = cf.querySelectorAll('ul, ol');
      lists.forEach(list => cellContent.appendChild(list.cloneNode(true)));
    } else {
      // Fallback: get paragraphs and lists from panel
      const paragraphs = panel.querySelectorAll('p');
      paragraphs.forEach(p => cellContent.appendChild(p.cloneNode(true)));
      const lists = panel.querySelectorAll('ul, ol');
      lists.forEach(list => cellContent.appendChild(list.cloneNode(true)));
    }
    rows.push([labelText, cellContent]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  cmpTabs.replaceWith(block);
}
