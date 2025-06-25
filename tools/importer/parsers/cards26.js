/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content section containing the cards
  const contentFragment = element.querySelector('.cmp-contentfragment__elements');
  if (!contentFragment) return;

  // Get all direct children (div, p, etc) of contentFragment
  const children = Array.from(contentFragment.children);
  const cards = [];
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    // Identify card: must have h2 in .title.cmp-title--underline and .image img
    if (
      node.querySelector &&
      node.querySelector('.title.cmp-title--underline h2') &&
      node.querySelector('.image img')
    ) {
      const heading = node.querySelector('.title.cmp-title--underline h2');
      const img = node.querySelector('.image img');
      // Find the next <p> sibling after this node (the card's description)
      let desc = null;
      let searchIdx = i + 1;
      while (searchIdx < children.length) {
        if (children[searchIdx].tagName === 'P') {
          desc = children[searchIdx];
          break;
        }
        searchIdx++;
      }
      if (heading && img && desc) {
        cards.push([img, [heading, desc]]);
        // Move i to after the desc
        i = searchIdx + 1;
        continue;
      }
    }
    i++;
  }
  if (!cards.length) return;
  const cells = [['Cards (cards26)', ...[]], ...cards];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
