/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !element.querySelector) return;

  // Table header row as specified
  const headerRow = ['Table (table11)'];

  // --- Left column: key-value info ---
  // Find the contentfragment with the adventure details
  const detailsFragment = element.querySelector('.cmp-contentfragment--climbing-new-zealand');
  let detailsBlock = null;
  if (detailsFragment) {
    // The <dl> contains the key-value pairs
    const dl = detailsFragment.querySelector('dl.cmp-contentfragment__elements');
    if (dl) {
      detailsBlock = dl;
    }
  }

  // --- Main content: tab panels ---
  const tabs = element.querySelector('.cmp-tabs');
  let overviewPanel = null;
  let itineraryPanel = null;
  let whatToBringPanel = null;
  if (tabs) {
    const tabPanels = tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
    tabPanels.forEach(panel => {
      const dataLayer = panel.getAttribute('data-cmp-data-layer');
      if (dataLayer) {
        try {
          const obj = JSON.parse(dataLayer.replace(/&quot;/g, '"'));
          const keys = Object.keys(obj);
          if (keys.length) {
            const title = obj[keys[0]] && obj[keys[0]]["dc:title"] ? obj[keys[0]]["dc:title"].toLowerCase() : '';
            if (title === 'overview') overviewPanel = panel;
            if (title === 'itinerary') itineraryPanel = panel;
            if (title === 'what to bring') whatToBringPanel = panel;
          }
        } catch(e) {}
      }
    });
    // Fallback: use order if not found
    if (!overviewPanel && tabPanels.length > 0) overviewPanel = tabPanels[0];
    if (!itineraryPanel && tabPanels.length > 1) itineraryPanel = tabPanels[1];
    if (!whatToBringPanel && tabPanels.length > 2) whatToBringPanel = tabPanels[2];
  }

  // --- Share block (optional) ---
  const shareTitle = element.querySelector('.title .cmp-title__text');
  const shareBlock = element.querySelector('.sharing');
  let shareContent = null;
  if (shareTitle && shareBlock) {
    const wrapper = document.createElement('div');
    wrapper.appendChild(shareTitle.cloneNode(true));
    wrapper.appendChild(shareBlock.cloneNode(true));
    shareContent = wrapper;
  }

  // --- Compose table rows ---
  const rows = [];
  if (detailsBlock) {
    rows.push([detailsBlock]);
  }
  if (shareContent) {
    rows.push([shareContent]);
  }
  if (overviewPanel) {
    rows.push([overviewPanel]);
  }
  if (itineraryPanel) {
    rows.push([itineraryPanel]);
  }
  if (whatToBringPanel) {
    rows.push([whatToBringPanel]);
  }
  if (rows.length === 0) return;

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
