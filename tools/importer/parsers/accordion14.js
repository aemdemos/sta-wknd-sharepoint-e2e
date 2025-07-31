/* global WebImporter */
export default function parse(element, { document }) {
  // Find first .cmp-accordion in the element's descendants
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return; // No accordion block found

  // Compose the header row as specified
  const headerRow = ['Accordion (accordion14)'];

  // Map over each accordion item to gather content
  const rows = Array.from(accordion.querySelectorAll(':scope > .cmp-accordion__item')).map((item) => {
    // Extract the title (use the .cmp-accordion__title span's text)
    let titleElem = item.querySelector('.cmp-accordion__title');
    let title;
    if (titleElem) {
      title = titleElem;
    } else {
      // Fallback to button's text (should not occur in this markup)
      const btn = item.querySelector('.cmp-accordion__button');
      title = document.createElement('span');
      title.textContent = btn ? btn.textContent.trim() : '';
    }

    // Extract the body/content
    // Panel is always .cmp-accordion__panel (may be hidden)
    let panel = item.querySelector('.cmp-accordion__panel');
    let contentNodes = [];
    if (panel) {
      // .cmp-accordion__panel contains a .container.responsivegrid, which itself usually contains a .cmp-container
      let inner = panel.querySelector('.container.responsivegrid');
      if (inner) {
        let cmpContainer = inner.querySelector('.cmp-container');
        if (cmpContainer) {
          // The cmp-container may itself contain one or more child elements, typically .text
          let directChildren = Array.from(cmpContainer.children);
          // For each child, if it's .text, use its children; else just use it
          directChildren.forEach(child => {
            if (child.classList.contains('text')) {
              Array.from(child.children).forEach(grandchild => {
                contentNodes.push(grandchild);
              });
            } else {
              contentNodes.push(child);
            }
          });
        } else {
          // No cmp-container, use the children of the responsivegrid
          Array.from(inner.children).forEach(child => contentNodes.push(child));
        }
      } else {
        // No responsivegrid, just use the inner HTML of panel
        Array.from(panel.childNodes).forEach(n => {
          if (n.nodeType === 1) {
            contentNodes.push(n);
          }
        });
      }
    }
    // If no content found, fallback to panel itself
    let content = contentNodes.length > 1 ? contentNodes : (contentNodes[0] || '');
    return [title, content];
  });

  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
