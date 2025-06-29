/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Find all card start blocks
  const cardTitleBlocks = Array.from(contentFragment.querySelectorAll('.cmp-title--underline'));
  const cards = [];

  cardTitleBlocks.forEach((titleBlock, idx) => {
    const h2 = titleBlock.querySelector('h2.cmp-title__text');
    // Gather all siblings after this block, up to the next card or end
    let siblings = [];
    let pointer = titleBlock.nextElementSibling;
    while (pointer && !(pointer.classList && pointer.classList.contains('cmp-title--underline'))) {
      siblings.push(pointer);
      pointer = pointer.nextElementSibling;
    }
    // Look for first image in siblings tree (search recursively)
    let imageEl = null;
    function findImageEl(node) {
      if (imageEl) return;
      if (node.querySelector && node.querySelector('.cmp-image')) {
        imageEl = node.querySelector('.cmp-image');
      } else if (node.children) {
        Array.from(node.children).forEach(child => findImageEl(child));
      }
    }
    siblings.forEach(sib => findImageEl(sib));

    // Gather all <p> as description (including address if present)
    const descPs = [];
    siblings.forEach(p => {
      if (p.tagName === 'P') descPs.push(p);
    });

    // Compose text cell: <strong>title</strong>, all desc <p> in order (with <br> between)
    const textCell = document.createElement('div');
    if (h2) {
      const strong = document.createElement('strong');
      strong.textContent = h2.textContent;
      textCell.appendChild(strong);
    }
    descPs.forEach(p => {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(p);
    });

    cards.push([imageEl || '', textCell]);
  });

  // Table header row, exactly as in the example
  const headerRow = ['Cards (cards38)'];
  const cells = [headerRow, ...cards];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  contentFragment.replaceWith(blockTable);
}
