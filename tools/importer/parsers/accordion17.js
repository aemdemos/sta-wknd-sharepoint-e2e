/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article contentfragment
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content area inside the contentfragment
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsRoot) return;

  // Find all h2 section headings that serve as accordion titles
  const headings = Array.from(elementsRoot.querySelectorAll('h2.cmp-title__text'));
  if (!headings.length) return;

  // Get all direct children of elementsRoot for flexible traversal
  const children = Array.from(elementsRoot.children);

  // Build rows for the accordion block
  const rows = [['Accordion (accordion17)']];

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    // Find the parent wrapper of the heading
    let headingWrapper = heading.closest('.cmp-title');
    // Find the index of the wrapper in children
    let startIdx = children.findIndex((el) => el.contains(headingWrapper) || el === headingWrapper);
    if (startIdx === -1) continue;
    // Find the next heading's index
    let nextHeadingIdx = children.length;
    for (let j = startIdx + 1; j < children.length; j++) {
      if (children[j].querySelector && children[j].querySelector('h2.cmp-title__text')) {
        nextHeadingIdx = j;
        break;
      }
    }
    // Gather all nodes between this heading and the next heading
    const contentNodes = [];
    for (let k = startIdx + 1; k < nextHeadingIdx; k++) {
      // Collect all descendant elements (not just direct children)
      if (children[k].nodeType === 1) {
        // If this is a container, get all its meaningful descendants
        const descendants = children[k].querySelectorAll('p, blockquote, img, div.cmp-image, div.cmp-text');
        if (descendants.length > 0) {
          descendants.forEach((node) => {
            if (node.tagName === 'IMG' || node.textContent.trim() !== '') {
              contentNodes.push(node.cloneNode(true));
            }
          });
        } else if (children[k].tagName === 'IMG' || children[k].textContent.trim() !== '') {
          contentNodes.push(children[k].cloneNode(true));
        }
      }
    }
    // Defensive: If no content, try to grab the next <p> after the heading
    if (contentNodes.length === 0) {
      let fallback = children[startIdx + 1];
      if (fallback && fallback.tagName === 'P') {
        contentNodes.push(fallback.cloneNode(true));
      }
    }
    // If still empty, fallback to empty string
    rows.push([
      heading.cloneNode(true),
      contentNodes.length ? contentNodes : ['']
    ]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
