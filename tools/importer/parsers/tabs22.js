/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find all tab labels (li elements, order matters)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find all tab panels (content containers), order matters
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Edge case: if number of panels doesn't match number of labels, match by aria-controls/id
  let rows = [];
  if (tabLabels.length === tabPanels.length) {
    // Build tabs data: array of [label, content]
    rows = tabLabels.map((labelEl, i) => {
      const label = labelEl.textContent.trim();
      const panel = tabPanels[i];
      // Compose a fragment with all direct children of the panel (preserve semantic content)
      const fragment = document.createDocumentFragment();
      Array.from(panel.children).forEach(child => {
        fragment.appendChild(child);
      });
      return [label, fragment];
    });
  } else {
    // Fallback: try to match panel by aria-controls/id
    rows = tabLabels.map(labelEl => {
      const label = labelEl.textContent.trim();
      const controlsId = labelEl.getAttribute('aria-controls');
      const panel = controlsId ? tabsBlock.querySelector(`#${controlsId}`) : null;
      let fragment = document.createDocumentFragment();
      if (panel) {
        Array.from(panel.children).forEach(child => {
          fragment.appendChild(child);
        });
      }
      return [label, fragment];
    });
  }

  // Compose the block table
  const tableCells = [
    ['Tabs (tabs22)'],
    ...rows
  ];

  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
