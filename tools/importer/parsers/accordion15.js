/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get the elements container inside the contentfragment
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Prepare header row
  const headerRow = ['Accordion (accordion15)'];
  const rows = [headerRow];

  // Each accordion item is a <h2> (title) and the following content (content)
  let children = Array.from(elementsContainer.children);
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.tagName === 'H2') {
      // This is a section title
      const title = node.textContent.trim();
      // Gather all content nodes until the next H2 or end
      const contentNodes = [];
      let j = i + 1;
      while (j < children.length && children[j].tagName !== 'H2') {
        const child = children[j];
        // If it's a grid wrapper, look for images inside
        if (child.classList && child.classList.contains('aem-Grid')) {
          const imageWrappers = child.querySelectorAll('div.image .cmp-image');
          imageWrappers.forEach(cmpImage => {
            contentNodes.push(cmpImage);
          });
        } else if (child.classList && child.classList.contains('image')) {
          const cmpImage = child.querySelector('.cmp-image');
          if (cmpImage) contentNodes.push(cmpImage);
        } else if (child.tagName === 'P') {
          contentNodes.push(child);
        }
        j++;
      }
      // If no contentNodes, fallback to empty string
      rows.push([title, contentNodes.length ? contentNodes : '']);
      i = j;
    } else {
      i++;
    }
  }

  // Defensive: If only header row, do nothing
  if (rows.length === 1) return;

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(table);
}
