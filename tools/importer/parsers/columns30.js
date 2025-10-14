/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to trim and flatten text
  function cleanText(node) {
    return node.textContent.trim();
  }

  // Find the main grid (the one with aem-Grid--12)
  const grid = element.querySelector('.aem-Grid--12');
  if (!grid) return;

  // --- LEFT COLUMN (Sidebar) ---
  // Title at the top
  const titleDiv = grid.querySelector('.cmp-title h1');
  // The first contentfragment (sidebar summary)
  const sidebarFragment = grid.querySelector('.cmp-contentfragment__elements');
  // The 'Share this Adventure' title
  const shareTitle = Array.from(grid.querySelectorAll('.cmp-title h5')).find(h => cleanText(h).toLowerCase().includes('share'));
  // The sharing buttons container
  const sharingDiv = grid.querySelector('.sharing');

  // Compose the left column content
  const leftCol = document.createElement('div');
  if (titleDiv) leftCol.appendChild(titleDiv.cloneNode(true));
  if (sidebarFragment) leftCol.appendChild(sidebarFragment.cloneNode(true));
  if (shareTitle) leftCol.appendChild(shareTitle.cloneNode(true));
  if (sharingDiv) {
    // Use the Facebook share button as a div (not a link)
    const fbDiv = sharingDiv.querySelector('.fb-share-button');
    if (fbDiv) leftCol.appendChild(fbDiv.cloneNode(true));
    // Pinterest button is already an anchor
    const pinLink = sharingDiv.querySelector('a[data-pin-do]');
    if (pinLink) leftCol.appendChild(pinLink.cloneNode(true));
  }

  // --- RIGHT COLUMN (Main Content) ---
  // Find the tabs block
  const tabs = grid.querySelector('.cmp-tabs');
  let rightCol = document.createElement('div');
  if (tabs) {
    // Tab navigation (tab headers)
    const tabList = tabs.querySelector('.cmp-tabs__tablist');
    if (tabList) rightCol.appendChild(tabList.cloneNode(true));
    // All tab panels (Overview, Itinerary, What to Bring)
    const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');
    tabPanels.forEach(panel => {
      // Only add panels that have meaningful content
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        // Insert HTML comments for model fields if present
        const model = cf.getAttribute('data-cmp-contentfragment-model');
        if (model) {
          // Try to extract field names from the contentfragment__elements
          const fields = Array.from(cf.querySelectorAll('.cmp-contentfragment__element-title')).map(e => cleanText(e));
          if (fields.length) {
            rightCol.appendChild(document.createComment('model: ' + model + ', fields: ' + fields.join(', ')));
          }
        }
        rightCol.appendChild(cf.cloneNode(true));
      }
    });
  }

  // --- Compose the table ---
  const headerRow = ['Columns (columns30)'];
  const contentRow = [leftCol, rightCol];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
