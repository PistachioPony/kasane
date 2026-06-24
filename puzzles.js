// ================================
// KASANE — puzzles.js
// All puzzle data lives here.
// To add a new puzzle, copy an existing object and fill in the content.
// Never need to touch script.js to add puzzles.
// ================================

const PUZZLES = [
  {
    id: 'denim-trail',
    title: 'The Denim Trail',
    instruction: 'Order these places by when they first shaped denim history — earliest to most recent.',
    items: [
      { id: 'india',   label: 'India',        sub: 'Indigo plant & cotton' },
      { id: 'genoa',   label: 'Genoa, Italy',  sub: 'Origin of "jean" fabric' },
      { id: 'nimes',   label: 'Nîmes, France', sub: 'Origin of "denim"' },
      { id: 'usa',     label: 'United States', sub: 'Riveted jeans patent' },
      { id: 'germany', label: 'Germany',       sub: 'Synthetic indigo' },
      { id: 'japan',   label: 'Japan',         sub: 'Selvedge renaissance' },
    ],
    correctOrder: ['india', 'genoa', 'nimes', 'usa', 'germany', 'japan'],
    facts: [
      { id: 'india',   fact: 'Indigo from the Indigofera plant has been cultivated in India for over 4,000 years — long before denim existed.' },
      { id: 'genoa',   fact: 'Sailors in Genoa wore sturdy "jeane" trousers — the word jeans comes from Gênes, the French name for Genoa.' },
      { id: 'nimes',   fact: 'Weavers in Nîmes tried to copy jeane fabric and accidentally created something new — Serge de Nîmes, shortened to denim.' },
      { id: 'usa',     fact: 'On May 20, 1873, Levi Strauss and Jacob Davis received U.S. Patent 139,121 for riveted work pants — blue jeans were born.' },
      { id: 'germany', fact: 'In 1897, BASF launched Indigo Pure — the first synthetic indigo. By 1914, it had replaced 95% of all natural indigo production.' },
      { id: 'japan',   fact: 'From the 1970s, Japanese brands like Samurai, Evisu and Fullcount studied vintage American denim with archival devotion, producing selvedge that now surpasses the original.' },
    ],
  },
  {
    id: 'first-edition',
    title: 'First Edition',
    instruction: 'Order these iconic jackets from oldest to most recent.',
    items: [
      { id: 'chore',    label: 'French Chore Coat', sub: 'Bleu de Travail' },
      { id: 'levi1',    label: "Levi's Type 1",      sub: '506XX' },
      { id: 'lee101j',  label: 'Lee 101J',           sub: 'Cowboy Jacket' },
      { id: 'n1',       label: 'US Navy N-1',        sub: 'Deck Jacket' },
      { id: 'levi2',    label: "Levi's Type 2",      sub: '507XX' },
      { id: 'levi3',    label: "Levi's Type 3",      sub: 'Trucker' },
    ],
    correctOrder: ['chore', 'levi1', 'lee101j', 'n1', 'levi2', 'levi3'],
    facts: [
      { id: 'chore',   fact: 'The French Chore Coat (bleu de travail) emerged in the late 19th century, worn by French manual workers and dyed a distinctive indigo blue — giving rise to the term \'bleu de travail,\' meaning blue work. The style remains a workwear icon today.' },
      { id: 'levi1',   fact: "The Levi's Type 1 (506XX) debuted in 1905 — identifiable by its cinch-back and single chest pocket. Early versions had no red tab." },
      { id: 'lee101j', fact: 'Lee introduced the 101J in 1934 as a companion to their 101 jeans — the first slim-fit denim jacket, designed for ranch work.' },
      { id: 'n1',      fact: 'The US Navy N-1 Deck Jacket was introduced in 1943 with jungle cloth exterior and alpaca lining. It became standard issue for sailors.' },
      { id: 'levi2',   fact: "The Type 2 (507XX) arrived in 1953 with two chest pockets. It was discontinued in the 1960s, making originals highly collectible." },
      { id: 'levi3',   fact: "The Levi's Type III (Lot 70505) debuted in 1967 during the Summer of Love. Its slimmer silhouette was designed to complement the new 505 jeans, and it became the most iconic denim jacket silhouette in the world." },
    ],
  },
  {
    id: 'founded',
    title: 'Founded',
    instruction: 'Order these denim brands by their founding year — oldest to newest.',
    items: [
      { id: 'bigjohn',   label: 'Big John',        sub: 'Kojima, Japan' },
      { id: 'sda',       label: "Studio D'Artisan", sub: 'Osaka, Japan' },
      { id: 'samurai',   label: 'Samurai Jeans',    sub: 'Osaka, Japan' },
      { id: 'ironheart', label: 'Iron Heart',       sub: 'Japan' },
      { id: 'nf',        label: 'Naked & Famous',   sub: 'Montreal, Canada' },
      { id: 'soso',      label: 'SoSo Brothers',    sub: 'Sweden' },
    ],
    correctOrder: ['bigjohn', 'sda', 'samurai', 'ironheart', 'nf', 'soso'],
    facts: [
      { id: 'bigjohn',   fact: "Founded in 1940 as Maruo Hifuku, Big John produced Japan's first domestically made jeans in 1965 using imported denim fabric." },
      { id: 'sda',       fact: "Studio D'Artisan was founded in Osaka in 1979 by Shigeharu Tagaki. It was an original member of the legendary Osaka 5." },
      { id: 'samurai',   fact: 'Toru Nogami founded Samurai Jeans in 1997 in Osaka, sewing jeans by himself from the start with an obsessive focus on vintage American denim construction.' },
      { id: 'ironheart', fact: 'Shinichi Haraki founded Iron Heart in 2002 after 20 years in the garment industry, building ultra-heavy denim for Japan\'s motorcycle and biker communities.' },
      { id: 'nf',        fact: 'Brandon Svarc founded Naked & Famous in Montreal in 2008, rejecting celebrity culture to focus purely on the fabric and construction.' },
      { id: 'soso',      fact: 'Founded in 2010 in Sweden by Jannis and Johan Blom — SOSO stands for South of Stockholm. They produce fully custom raw denim in Thailand.' },
    ],
  },
  {
    id: 'into-the-blue',
    title: 'Into the Blue',
    instruction: 'Order these dyeing methods and innovations — earliest to most recent.',
    items: [
      { id: 'hank',      label: 'Hank Dyeing',               sub: 'Hand bundle method' },
      { id: 'synthetic', label: 'Synthetic Indigo',          sub: 'Industrial era' },
      { id: 'rope',      label: 'Rope Dyeing',               sub: 'Bundle dip method' },
      { id: 'slasher',   label: 'Slasher / Sheet Dyeing',    sub: 'Continuous flat process' },
      { id: 'garment',   label: 'Garment Dyeing',            sub: 'Post-construction' },
      { id: 'foam',      label: 'Foam Dyeing',               sub: 'Sustainable era' },
    ],
    correctOrder: ['hank', 'synthetic', 'rope', 'slasher', 'garment', 'foam'],
    facts: [
      { id: 'hank',      fact: 'Hank dyeing is one of the oldest yarn dyeing methods — loose bundles of yarn are dipped by hand into indigo vats and oxidised in the air. Premium Japanese mills still use it today because the slow, repeated dipping creates the deepest, most authentic ring-dyed fades.' },
      { id: 'synthetic', fact: "In 1897, BASF's Indigo Pure launched the synthetic era. By 1914, it had replaced 95% of all natural indigo worldwide." },
      { id: 'rope',      fact: "Invented in 1915, rope dyeing bundles yarns into ropes passed through indigo vats repeatedly — creating denim's characteristic ring-dyed fade." },
      { id: 'slasher',   fact: 'Developed in the 1970s, slasher dyeing lays yarns flat as a sheet. Faster than rope dyeing, but produces less character in the fade.' },
      { id: 'garment',   fact: 'Garment dyeing — dyeing the finished jean rather than the yarn — became widespread in the 1980s, enabling overdyed and colour-washed styles.' },
      { id: 'foam',      fact: 'Foam dyeing emerged in the 2010s, using foam as a dye carrier. It reduces water use by up to 40%. Wrangler debuted it commercially in 2019.' },
    ],
  },
  {
    id: 'heavy-hitters',
    title: 'Heavy Hitters',
    instruction: 'Order these brands by the weight of their signature heavyweight denim — lightest to heaviest.',
    items: [
      { id: 'samurai-hh',  label: 'Samurai Jeans',  sub: 'Kiwami' },
      { id: 'oni',         label: 'Oni Denim',       sub: 'Secret Denim' },
      { id: 'ironheart-hh',label: 'Iron Heart',      sub: 'Signature Selvedge' },
      { id: 'tsg',         label: 'The Strike Gold', sub: 'Extra Hard' },
      { id: 'soso-hh',     label: 'SoSo Brothers',   sub: 'Breaker of Legs' },
      { id: 'nf-hh',       label: 'Naked & Famous',  sub: 'Super Heavyweight' },
    ],
    correctOrder: ['samurai-hh', 'oni', 'ironheart-hh', 'tsg', 'soso-hh', 'nf-hh'],
    facts: [
      { id: 'samurai-hh',  fact: "Samurai's 19oz Kiwami (meaning 'pinnacle') was the heaviest jean in the world when it launched in 2003." },
      { id: 'oni',         fact: "Oni's 20oz Secret Denim is famous not just for its weight but for its extraordinary slubby texture and surprising softness." },
      { id: 'ironheart-hh',fact: "Iron Heart's 21oz selvedge is the brand's soul — built originally for motorcyclists who needed jeans that could survive a slide." },
      { id: 'tsg',         fact: "The Strike Gold's 24.8oz Extra Hard denim is so dense that sewing needles break during production." },
      { id: 'soso-hh',     fact: 'SoSo Brothers\' 33oz "Breaker of Legs" is named for how stiff and heavy the fabric is straight out of the bag.' },
      { id: 'nf-hh',       fact: 'Naked & Famous\' 40oz denim is currently the world\'s heaviest. Each pair took multiple days to sew and sold out immediately at $2,040.' },
    ],
  },
];
