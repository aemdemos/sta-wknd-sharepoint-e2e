/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all groups (Contributors, Guides) with their description and cards
  function getGroups(scope) {
    // Find all h2.cmp-title__text which separate groups
    const groupTitles = Array.from(scope.querySelectorAll('h2.cmp-title__text'));
    const groups = [];
    groupTitles.forEach((h2) => {
      // Find group container
      let groupParent = h2.closest('.cmp-title');
      let n = groupParent.parentElement;
      // Find the next .cmp-text--font-small for the group description
      let desc = null;
      let search = n.nextElementSibling;
      while (search && !desc) {
        if (
          search.classList &&
          search.classList.contains('cmp-text--font-small')
        ) {
          desc = search.querySelector('.cmp-text') || search;
        }
        if (desc) break;
        // stop if next h2 found
        if (search.querySelector && search.querySelector('h2.cmp-title__text')) break;
        search = search.nextElementSibling;
      }
      // Find all consecutive card sections after desc
      const cards = [];
      let cardSearch = (desc ? desc.parentElement : n).nextElementSibling;
      while (cardSearch) {
        // Stop if next group
        if (cardSearch.querySelector && cardSearch.querySelector('h2.cmp-title__text')) break;
        if (cardSearch.matches && cardSearch.matches('section.experiencefragment.cmp-experience-fragment--contributor')) {
          cards.push(cardSearch);
        }
        cardSearch = cardSearch.nextElementSibling;
      }
      groups.push({desc, cards});
    });
    return groups;
  }

  // Helper: extract card row from section, prepending desc to first card
  function cardRow(section, prependDesc) {
    const img = section.querySelector('.cmp-image__image');
    const textElements = [];
    if (prependDesc) {
      // Prepend the intro description (all nodes)
      Array.from(prependDesc.childNodes).forEach(node => {
        textElements.push(node.cloneNode(true));
      });
      textElements.push(document.createElement('br'));
    }
    const h3 = section.querySelector('h3');
    if (h3) textElements.push(h3);
    const h5 = section.querySelector('h5');
    if (h5) textElements.push(document.createElement('br'), h5);
    section.querySelectorAll('p').forEach(p => {
      textElements.push(document.createElement('br'), p);
    });
    const socialButtons = Array.from(section.querySelectorAll('.cmp-button'));
    if (socialButtons.length) {
      textElements.push(document.createElement('br'));
      const socialsDiv = document.createElement('div');
      socialButtons.forEach(btn => socialsDiv.appendChild(btn));
      textElements.push(socialsDiv);
    }
    if (!textElements.length) textElements.push(document.createTextNode(''));
    return [img, textElements];
  }

  // Compose table
  const groups = getGroups(element);
  if (!groups.length) return;
  const rows = [['Cards (cards24)']];
  groups.forEach(group => {
    group.cards.forEach((cardSection, idx) => {
      rows.push(cardRow(cardSection, idx === 0 && group.desc ? group.desc : null));
    });
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
