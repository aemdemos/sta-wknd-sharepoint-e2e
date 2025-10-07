/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordion = element.querySelector('.accordion, .cmp-accordion');
  if (!accordion) return;

  // Find all accordion items
  const items = Array.from(accordion.querySelectorAll('.cmp-accordion__item'));
  if (!items.length) return;

  // Compose header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // For each accordion item, extract plain text title and content
  items.forEach(item => {
    // Title: get plain text from the button (not markup)
    let titleText = '';
    const btn = item.querySelector('button');
    if (btn) {
      // Only use the visible text, not icons
      const span = btn.querySelector('.cmp-accordion__title');
      if (span) {
        titleText = span.textContent.trim();
      } else {
        // fallback: remove icon span if present
        let btnText = btn.textContent;
        const icon = btn.querySelector('.cmp-accordion__icon');
        if (icon) {
          btnText = btnText.replace(icon.textContent, '');
        }
        titleText = btnText.trim();
      }
    }
    // Defensive fallback: if no button, try span
    if (!titleText) {
      const span = item.querySelector('.cmp-accordion__title');
      if (span) titleText = span.textContent.trim();
    }
    // Use plain text node for the title
    const title = document.createTextNode(titleText);

    // Content: find the panel
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = null;
    if (panel) {
      // Defensive: find the first .cmp-text inside the panel
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        content = textBlock;
      } else {
        // fallback: use panel itself
        content = panel;
      }
    } else {
      content = document.createTextNode('');
    }

    rows.push([title, content]);
  });

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion element with the block
  accordion.replaceWith(block);
}
