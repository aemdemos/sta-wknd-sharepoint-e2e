/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const rows = [['Cards']];

  // Find the content fragment main body
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll collect all direct children under cfElements
  const children = Array.from(cfElements.children);

  let i = 0;
  while (i < children.length) {
    let child = children[i];
    // Only start a card if this child is a .title containing h2.cmp-title__text
    if (
      child.classList &&
      child.classList.contains('title') &&
      child.querySelector('h2.cmp-title__text')
    ) {
      const cardContent = [];
      // Heading
      const h2 = child.querySelector('h2.cmp-title__text');
      if (h2) cardContent.push(h2);
      // Check next sibling for image
      let j = i + 1;
      if (
        j < children.length &&
        children[j].classList &&
        children[j].classList.contains('image')
      ) {
        cardContent.push(children[j]);
        j++;
      }
      // Gather <p> tags and content until next .title with h2.cmp-title__text or end of list
      while (
        j < children.length &&
        !(
          children[j].classList &&
          children[j].classList.contains('title') &&
          children[j].querySelector('h2.cmp-title__text')
        )
      ) {
        // If <p>, add directly
        if (children[j].tagName === 'P') {
          cardContent.push(children[j]);
        } else {
          // If it's a div, gather any paragraphs inside (e.g. quotes or callouts)
          const ps = children[j].querySelectorAll ? children[j].querySelectorAll('p') : [];
          ps.forEach((p) => cardContent.push(p));
        }
        j++;
      }
      // Only add card row if there is card content
      if (cardContent.length > 0) {
        rows.push([cardContent]);
      }
      i = j;
    } else {
      i++;
    }
  }

  // Only replace if we created some cards
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
