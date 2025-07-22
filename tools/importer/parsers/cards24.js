/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find all section boundaries (Contributors / Guides) with their cards
  function getGroupings(el) {
    // Find all .cmp-title__text h2 headings (Our Contributors, WKND Guides)
    const groupTitles = Array.from(el.querySelectorAll('.cmp-title__text'))
      .filter(h => h.parentElement.parentElement.classList.contains('cmp-title') && (h.tagName === 'H2'));
    const groupings = [];
    groupTitles.forEach((h, idx) => {
      // The group container is the closest .aem-Grid or .cmp-container after the heading
      // But more robust: Gather all nodes between this h2 and next h2
      let nodes = [];
      let curr = h.parentElement.parentElement.parentElement.parentElement.nextSibling;
      while (curr && !(curr.querySelector && curr.querySelector('.cmp-title__text') && curr.querySelector('.cmp-title__text').tagName === 'H2')) {
        if (curr.nodeType === 1) nodes.push(curr);
        curr = curr.nextSibling;
      }
      // Find group intro text (italic paragraph)
      let intro = null;
      for (const n of nodes) {
        if (n.querySelector && n.querySelector('.cmp-text')) {
          intro = n.querySelector('.cmp-text');
          break;
        }
      }
      // Find all contributor/guide sections (cards) in nodes
      const cards = [];
      nodes.forEach(n => {
        if (n.matches && n.matches('section.experiencefragment')) cards.push(n);
      });
      groupings.push({
        heading: h,
        intro,
        cards
      });
    });
    return groupings;
  }

  function extractCardContent(section) {
    const img = section.querySelector('.cmp-image img');
    const nameTitle = section.querySelector('.cmp-title h3');
    const subtitleTitle = section.querySelector('.cmp-title h5');
    const socialButtons = Array.from(section.querySelectorAll('a.cmp-button'));
    let socialsDiv = null;
    if (socialButtons.length > 0) {
      socialsDiv = document.createElement('div');
      socialsDiv.className = 'contributor-socials';
      socialButtons.forEach(btn => socialsDiv.appendChild(btn));
    }
    const textCellContent = [];
    if (nameTitle) {
      const strong = document.createElement('strong');
      strong.textContent = nameTitle.textContent;
      textCellContent.push(strong);
    }
    if (subtitleTitle) {
      if (nameTitle) textCellContent.push(document.createElement('br'));
      textCellContent.push(document.createTextNode(subtitleTitle.textContent));
    }
    if (socialsDiv) {
      if (nameTitle || subtitleTitle) textCellContent.push(document.createElement('br'));
      textCellContent.push(socialsDiv);
    }
    return [img, textCellContent];
  }

  const groupings = getGroupings(element);
  if (!groupings.length) return;

  // For each group, create a table for the cards, include heading and intro above
  const blocks = [];
  groupings.forEach(group => {
    // Insert heading h2
    if (group.heading) blocks.push(group.heading);
    // Insert intro text if present
    if (group.intro) blocks.push(group.intro);
    // Only create table if there are cards
    if (group.cards.length > 0) {
      const cells = [];
      cells.push(['Cards (cards24)']);
      group.cards.forEach(section => {
        const [img, textContent] = extractCardContent(section);
        if (img && textContent.length) {
          cells.push([img, textContent]);
        }
      });
      blocks.push(WebImporter.DOMUtils.createTable(cells, document));
    }
  });

  // Replace the original element (main) with the new structure
  const frag = document.createDocumentFragment();
  blocks.forEach(b => frag.appendChild(b));
  element.replaceWith(frag);
}
