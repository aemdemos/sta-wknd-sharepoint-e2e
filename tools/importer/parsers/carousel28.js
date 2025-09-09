/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate on the main tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Find all tab panels
  const tabPanels = element.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  if (!tabPanels.length) return;

  // Build the header row
  const headerRow = ['Carousel (carousel28)'];
  const rows = [headerRow];

  // For each tab panel, extract the first image and its associated text content
  tabPanels.forEach((panel) => {
    // Find the first image (mandatory for carousel slide)
    let imageEl = panel.querySelector('img');
    if (!imageEl) return;
    let cmpImageDiv = imageEl.closest('.cmp-image');
    let imageCell = cmpImageDiv ? cmpImageDiv : imageEl;

    // For the text cell: collect all content except the image
    const textCellContent = [];
    // Find the .cmp-contentfragment__elements (the main content container)
    const contentFragmentElements = panel.querySelector('.cmp-contentfragment__elements');
    if (contentFragmentElements) {
      Array.from(contentFragmentElements.children).forEach((child) => {
        // Skip grid wrappers and image wrappers
        if (
          child.classList.contains('aem-Grid') ||
          child.querySelector('img')
        ) {
          return;
        }
        if (child.textContent.trim() || child.querySelector('a')) {
          textCellContent.push(child);
        }
      });
    }
    // If no text content found, try to grab the .cmp-contentfragment__title
    if (textCellContent.length === 0) {
      const title = panel.querySelector('.cmp-contentfragment__title');
      if (title) textCellContent.push(title);
    }
    // If still empty, fallback to the whole panel minus the image
    if (textCellContent.length === 0) {
      const panelClone = panel.cloneNode(true);
      const imgInClone = panelClone.querySelector('img');
      if (imgInClone) imgInClone.remove();
      textCellContent.push(panelClone);
    }
    rows.push([
      imageCell,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  if (table) {
    element.replaceWith(table);
  }
}
