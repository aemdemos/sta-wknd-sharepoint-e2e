/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab headers (tab labels)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (tab content)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: tab labels and panels count must match
  if (tabLabels.length !== tabPanels.length) return;

  // Check for contentfragment model in each tab panel
  // If present, extract field names and add as HTML comments in the content cell
  function getModelFields(panel) {
    const cf = panel.querySelector('[data-cmp-contentfragment-model]');
    if (!cf) return [];
    // Try to get fields from cmp-data-layer (elements)
    let fields = [];
    const dataLayer = cf.getAttribute('data-cmp-data-layer');
    if (dataLayer) {
      try {
        const obj = JSON.parse(dataLayer.replace(/&quot;/g, '"'));
        const key = Object.keys(obj)[0];
        if (obj[key] && Array.isArray(obj[key].elements)) {
          fields = obj[key].elements.map(e => e['xdm:title']).filter(Boolean);
        }
      } catch(e) {}
    }
    return fields;
  }

  // Build the table rows
  const rows = [];
  // Header row as specified
  rows.push(['Tabs (tabs34)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    const panelContent = document.createElement('div');
    Array.from(panel.childNodes).forEach(node => {
      panelContent.appendChild(node.cloneNode(true));
    });
    // Add model fields as HTML comments if present
    const fields = getModelFields(panel);
    if (fields.length) {
      const comment = document.createComment('fields: ' + fields.join(', '));
      panelContent.insertBefore(comment, panelContent.firstChild);
    }
    rows.push([label, panelContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the block
  tabs.replaceWith(block);
}
