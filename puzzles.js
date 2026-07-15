// ================================
// KASANE — puzzles.js
// All puzzle content lives here, organized by theme.
// To add a new puzzle, copy an existing object inside a theme's
// puzzles array and fill in the content — no need to touch script.js.
// To add a whole new theme, copy a theme block (id/name/tagline/
// titleTiers/puzzles) and give it a new key on THEMES.
// ================================

const THEMES = {
  denim: {
    id: 'denim',
    name: 'Denim History',
    tagline: 'Five puzzles on denim\'s origins, icons, and brands.',
    titleLabel: 'YOUR DENIM TITLE',
    sourcesLine: 'Facts sourced from Heddels, Denimhunters, Long John, Levi Strauss & Co., BASF and Iron Heart.',

    // Which visual skin (style.css [data-skin]) this theme renders in.
    // Multiple themes can share a skin — e.g. a future Leather Jackets
    // pack would also use 'leather' — so no new CSS is needed per theme.
    skin: 'denim',

    // Reward tiers shown on the final share card. Color is derived from
    // the skin by rank at render time (see getTierColor in script.js),
    // not stored here — only the name/emoji change per theme's voice.
    titleTiers: {
      top:    { name: 'FADE LEGEND', emoji: '🏆' },
      second: { name: 'SAMURAI',     emoji: '⚔️' },
      third:  { name: 'DENIM HEAD',  emoji: '🧵' },
      bottom: { name: 'RAW RECRUIT', emoji: '🪡' },
    },

    puzzles: [
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
          { id: 'soso',      label: 'SoSo Brothers',    sub: 'South of Stockholm' },
        ],
        correctOrder: ['bigjohn', 'sda', 'samurai', 'ironheart', 'nf', 'soso'],
        facts: [
          { id: 'bigjohn',   fact: "Founded in 1940 as Maruo Hifuku, Big John produced Japan's first domestically made jeans in 1965 using imported denim fabric." },
          { id: 'sda',       fact: "Studio D'Artisan was founded in Osaka in 1979 by Shigeharu Tagaki. It was an original member of the legendary Osaka 5." },
          { id: 'samurai',   fact: 'Toru Nogami founded Samurai Jeans in 1997 in Osaka, sewing jeans by himself from the start with an obsessive focus on vintage American denim construction.' },
          { id: 'ironheart', fact: 'Shinichi Haraki founded Iron Heart in 2002 after 20 years in the garment industry, building ultra-heavy denim for Japan\'s motorcycle and biker communities.' },
          { id: 'nf',        fact: 'Brandon Svarc founded Naked & Famous in Montreal in 2008, rejecting celebrity culture to focus purely on the fabric and construction.' },
          { id: 'soso',      fact: 'Founded in 2010 in Sweden by Jannis and Johan Blom — SOSO stands for South of Stockholm. They produce fully custom raw denim.' },
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
    ],
  },

  boots: {
    id: 'boots',
    name: 'Boot Trivia',
    tagline: 'Five puzzles on heritage boot brands, craft, and style.',
    titleLabel: 'YOUR BOOT TITLE',
    sourcesLine: 'Facts researched from brand histories and the heritage bootmaking community — spot a correction? Let us know.',

    // 'leather' skin — also used by the future Leather Jackets pack.
    skin: 'leather',

    titleTiers: {
      top:    { name: 'OLD SOLE',    emoji: '🥾' },
      second: { name: 'JOURNEYMAN',  emoji: '🔨' },
      third:  { name: 'BOOT HEAD',   emoji: '👢' },
      bottom: { name: 'GREENHORN',   emoji: '🤠' },
    },

    // NOTE: several dates below are best-guess, flagged inline — fix as
    // corrections come in, same "good enough for now" approach as the
    // rest of this pack.
    puzzles: [
      {
        id: 'cobblers-row',
        title: "Cobbler's Row",
        instruction: 'Order these heritage bootmakers by their founding year — oldest to newest.',
        items: [
          { id: 'whites',    label: "White's Boots", sub: 'Spokane, WA' },
          { id: 'wolverine', label: 'Wolverine',     sub: 'Rockford, MI' },
          { id: 'alden',     label: 'Alden',         sub: 'Middleborough, MA' },
          { id: 'redwing',   label: 'Red Wing',      sub: 'Red Wing, MN' },
          { id: 'wesco',     label: 'Wesco',         sub: 'Scappoose, OR' },
          { id: 'lofgren',   label: 'John Lofgren',  sub: 'Japan' },
        ],
        correctOrder: ['whites', 'wolverine', 'alden', 'redwing', 'wesco', 'lofgren'],
        facts: [
          { id: 'whites',    fact: "White's Boots was founded in 1853, making it one of the oldest bootmakers in America — still hand-lasting boots the same way generations of craftsmen did." },
          { id: 'wolverine', fact: 'Founded in 1883 in Rockford, Michigan, Wolverine later partnered with Horween Leather to create the 1000 Mile Boot in 1914 — one of the most reproduced silhouettes in heritage footwear.' },
          { id: 'alden',     fact: 'Alden Shoe Company was founded in 1884 in Massachusetts and remains one of the last American makers to work extensively in shell cordovan, a leather prized for its density and lifelong durability.' },
          { id: 'redwing',   fact: "Founded in 1905 in Red Wing, Minnesota, the company's Iron Ranger and Beckman lines remain two of the most recognized silhouettes in American workwear." },
          { id: 'wesco',     fact: 'West Coast Shoe Company (Wesco) was founded in 1918 in Oregon, building custom logger and engineer boots entirely by hand — many customers wait months for a made-to-order pair.' },
          { id: 'lofgren',   fact: "John Lofgren is a much newer name on this list — an American designer producing vintage-reproduction boots in Japan, continuing the same archival obsession that drove Japan's denim revival." },
        ],
      },
      {
        id: 'sole-searching',
        title: 'Sole Searching',
        instruction: 'Order these boot sole constructions by when each was invented — earliest to most recent.',
        items: [
          { id: 'stitchdown', label: 'Stitchdown',  sub: 'Veldtschoen' },
          { id: 'blake',      label: 'Blake Stitch', sub: 'Single-pass sewing' },
          { id: 'goodyear',   label: 'Goodyear Welt', sub: 'Two-row welted' },
          { id: 'blakerapid', label: 'Blake Rapid',   sub: 'Hybrid construction' },
        ],
        correctOrder: ['stitchdown', 'blake', 'goodyear', 'blakerapid'],
        facts: [
          { id: 'stitchdown', fact: "Stitchdown (Veldtschoen) construction dates back centuries, originating as a 'field shoe' built to keep water out — the upper is flared outward and stitched directly to the midsole, covering the seam entirely." },
          { id: 'blake',      fact: 'Patented by Lyman Reed Blake in 1858, the Blake stitch sews directly through the insole, midsole, and outsole in a single pass — slim and lightweight, but the stitch holes let water wick inside.' },
          { id: 'goodyear',   fact: 'Charles Goodyear Jr. patented the Goodyear welt machine in 1869, mechanizing a two-row stitch that keeps the inner footbed sealed from the elements — still the gold standard for resoleable, weatherproof boots.' },
          { id: 'blakerapid', fact: 'Blake Rapid construction combines a Blake-stitched upper with a separately stitched outsole, giving Italian-style slimness the rebuildable durability the original Blake stitch lacks.' },
        ],
      },
      {
        id: 'worn-paths',
        title: 'Worn Paths',
        instruction: 'Order these boot styles by when each design first emerged — earliest to most recent.',
        items: [
          { id: 'cowboy',   label: 'Cowboy Boot',  sub: 'Texas, 1870s' },
          { id: 'harness',  label: 'Harness Boot',  sub: 'Cavalry riding boot' },
          { id: 'logger',   label: 'Logger Boot',   sub: 'Pacific Northwest' },
          { id: 'engineer', label: 'Engineer Boot', sub: 'Motorcycle culture' },
          { id: 'roper',    label: 'Roper Boot',    sub: 'Rodeo work boot' },
        ],
        correctOrder: ['cowboy', 'harness', 'logger', 'engineer', 'roper'],
        facts: [
          { id: 'cowboy',   fact: 'The cowboy boot emerged from Texas in the 1870s, adapting the riding boots of Mexican vaqueros with a higher heel for staying in the stirrup.' },
          { id: 'harness',  fact: 'The harness boot evolved from 19th-century U.S. Cavalry riding boots, later adapted for motorcycle riding. Its fixed four-strap, O-ring hardware was modeled after actual horse harness tack, built for rigid ankle stability rather than adjustable fit.' },
          { id: 'logger',   fact: 'Logger boots developed in the Pacific Northwest in the early 1900s, built with a stacked heel that let loggers stand safely on rolling timber.' },
          { id: 'engineer', fact: 'The engineer boot took shape in the 1930s and 40s among American motorcyclists and railroad workers, prized for its strapped, buckle-free design that could be pulled on and off quickly.' },
          { id: 'roper',    fact: 'The roper boot emerged later in the 20th century as a lower-heeled, closer-fitting cowboy boot built for actual rodeo work rather than riding.' },
        ],
      },
      {
        id: 'the-originals',
        title: 'The Originals',
        instruction: 'Order these iconic boot models by their debut year — earliest to most recent.',
        items: [
          { id: 'wolverine-orig', label: 'Wolverine 1000 Mile', sub: '1914' },
          { id: 'redwing-orig',   label: 'Red Wing Iron Ranger', sub: '1938' },
          { id: 'whites-orig',    label: "White's Smoke Jumper", sub: '1940s' },
          { id: 'alden-orig',     label: 'Alden Indy Boot',      sub: 'WWII-era design' },
          { id: 'wesco-orig',     label: 'Wesco Jobmaster',      sub: 'Mid-century' },
        ],
        correctOrder: ['wolverine-orig', 'redwing-orig', 'whites-orig', 'alden-orig', 'wesco-orig'],
        facts: [
          { id: 'wolverine-orig', fact: 'Wolverine partnered with Horween Leather in 1914 to create the 1000 Mile Boot, named for a marketing claim that it could withstand 1,000 miles of wear.' },
          { id: 'redwing-orig',   fact: "The Iron Ranger debuted in 1938, styled after the boots worn by Minnesota's iron ore miners — its cap toe remains one of the most recognized silhouettes in heritage footwear." },
          { id: 'whites-orig',    fact: "White's built the Smoke Jumper for the U.S. Forest Service's earliest wildland firefighters, who began parachuting into remote fires in 1939 and needed boots that could survive the landing." },
          { id: 'alden-orig',     fact: "Alden's plain-toe boot became famous decades after its design first appeared, once fans identified it as the boot Harrison Ford wore in Raiders of the Lost Ark — today it's sold as the 'Indy Boot.'" },
          { id: 'wesco-orig',     fact: 'The Wesco Jobmaster is the brand\'s classic strapped engineer-style boot, still built to order in their Oregon factory one pair at a time.' },
        ],
      },
      {
        id: 'boot-state-of-mind',
        title: 'Boot State of Mind',
        instruction: 'Order these heritage brands by the U.S. state where they\'re made — alphabetically, A to Z.',
        items: [
          { id: 'alden-state',     label: 'Alden',    sub: 'Massachusetts' },
          { id: 'wolverine-state', label: 'Wolverine', sub: 'Michigan' },
          { id: 'redwing-state',   label: 'Red Wing',  sub: 'Minnesota' },
          { id: 'wesco-state',     label: 'Wesco',     sub: 'Oregon' },
          { id: 'whites-state',    label: "White's",   sub: 'Washington' },
        ],
        correctOrder: ['alden-state', 'wolverine-state', 'redwing-state', 'wesco-state', 'whites-state'],
        facts: [
          { id: 'alden-state',     fact: 'Alden has built its boots in Middleborough, Massachusetts since the 19th century.' },
          { id: 'wolverine-state', fact: "Wolverine's original factory has stood in Rockford, Michigan since 1883." },
          { id: 'redwing-state',   fact: 'Red Wing boots are still made in the city they\'re named for — Red Wing, Minnesota.' },
          { id: 'wesco-state',     fact: 'Wesco hand-builds every boot to order in Scappoose, Oregon.' },
          { id: 'whites-state',    fact: "White's Boots has long been associated with Spokane, Washington, though ownership and location details are worth double-checking before this goes fully live." },
        ],
      },
    ],
  },
};
