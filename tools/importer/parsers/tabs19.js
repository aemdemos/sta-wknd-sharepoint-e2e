/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab label elements (li inside ol.cmp-tabs__tablist)
  const tabLabelNodes = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panel elements, which should be direct children of the .cmp-tabs block
  const tabPanelNodes = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the header row (matches exactly the required header)
  const cells = [['Tabs (tabs19)']];

  // For each tab label, find its associated panel by aria-controls = panel.id
  for (let i = 0; i < tabLabelNodes.length; i++) {
    const tabLabelNode = tabLabelNodes[i];
    const labelText = tabLabelNode.textContent.trim();
    const ariaControls = tabLabelNode.getAttribute('aria-controls');

    // Find the matching tab panel by id
    const panelNode = tabPanelNodes.find(panel => panel.id === ariaControls);
    if (!panelNode) continue; // skip tab if panel is missing

    // Reference the *main* content node for the tab, usually '.contentfragment' under the panel
    // If not found, use the panel itself
    let tabContentNode = panelNode.querySelector('.contentfragment') || panelNode;

    // Add row: [Tab Label, Tab Content]
    cells.push([labelText, tabContentNode]);
  }

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
