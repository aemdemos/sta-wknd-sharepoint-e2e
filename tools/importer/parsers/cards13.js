/* global WebImporter */
export default function parse(element, { document }) {
  // Find the contentfragment block which contains the surf spots cards
  const contentFragment = element.querySelector('.contentfragment .cmp-contentfragment');
  if (!contentFragment) return;
  const elementsWrapper = contentFragment.querySelector('.cmp-contentfragment__elements > div:last-of-type');
  if (!elementsWrapper) return;

  // Prepare rows for the cards block table
  const rows = [['Cards (cards13)']];
  const children = Array.from(elementsWrapper.childNodes).filter(node => node.nodeType === 1);

  // Helper: get the next element node (skips non-elements)
  function getNextElement(nodes, fromIdx) {
    for (let i = fromIdx + 1; i < nodes.length; i++) {
      if (nodes[i].nodeType === 1) return [nodes[i], i];
    }
    return [null, -1];
  }

  // For each h2 card title, find its image (optional) and ALWAYS its <p> desc
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.tagName.toLowerCase() === 'h2') {
      const titleNode = node;
      // Try image
      let imageElem = null;
      let nextIdx = i;
      let [possibleImageDiv, imgIdx] = getNextElement(children, nextIdx);
      if (possibleImageDiv && possibleImageDiv.querySelector && possibleImageDiv.querySelector('.image .cmp-image__image')) {
        imageElem = possibleImageDiv.querySelector('.image .cmp-image__image');
        nextIdx = imgIdx;
      }
      // Now, from nextIdx, ALWAYS find the next <p> - even if separated by empty <div>s
      let descElem = null;
      let searchIdx = nextIdx;
      while (true) {
        const [possibleDesc, dIdx] = getNextElement(children, searchIdx);
        if (!possibleDesc) break;
        if (possibleDesc.tagName && possibleDesc.tagName.toLowerCase() === 'p') {
          descElem = possibleDesc;
          searchIdx = dIdx;
          break;
        } else {
          searchIdx = dIdx;
        }
      }
      // Compose text cell: <strong>Title</strong><br><p>Desc</p>
      const textCell = [];
      if (titleNode && titleNode.textContent) {
        const strong = document.createElement('strong');
        strong.textContent = titleNode.textContent;
        textCell.push(strong);
      }
      if (descElem) {
        if (textCell.length) textCell.push(document.createElement('br'));
        textCell.push(descElem);
        i = searchIdx; // advance i to just after desc
      }
      // Image cell (always present)
      if (!imageElem) {
        imageElem = document.createElement('img');
        imageElem.alt = '';
        imageElem.style.display = 'none';
      }
      rows.push([imageElem, textCell]);
    }
  }
  const block = WebImporter.DOMUtils.createTable(rows, document);
  contentFragment.replaceWith(block);
}
