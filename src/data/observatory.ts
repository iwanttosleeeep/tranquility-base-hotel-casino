// The Observatory — ten conceptual frameworks for reading retro-futurist culture.
// NOTE: Academic correspondence is not evidence of creative influence. These
// frameworks are analytical instruments, not claims about what any artist read.

export interface ObservatoryReference {
  citation: string;
  url?: string;
}

export interface ObservatoryConcept {
  id: string;
  icon: string; // lucide icon key, resolved in ObservatoryView
  title: string;
  academicName: string;
  cluster: string;
  definition: string;
  explanation: string;
  references: ObservatoryReference[];
}

export const OBSERVATORY_CLUSTERS = [
  "Capital, Space & Consumption",
  "Information, Media & Attention",
  "Simulation & Digital Identity",
  "Science Fiction as Critique",
  "Truth, Knowledge & Public Reality",
] as const;

export const OBSERVATORY_CONCEPTS: ObservatoryConcept[] = [
  {
    id: "moon-resort",
    icon: "Moon",
    title: "The Moon Resort",
    academicName: "Commodification of Outer Space / Space Tourism",
    cluster: "Capital, Space & Consumption",
    definition:
      "Capitalism progressively converts outer space — once outside the economic system entirely — into a new domain that can be owned, invested in, developed, consumed, and accumulated.",
    explanation:
      "Sociologists of space argue that the cosmos functions as capitalism's newest 'outside': a frontier onto which existing economic logics expand once terrestrial opportunities for accumulation tighten. On this reading, space exploration is never a purely scientific enterprise. Ventures such as orbital tourism, lunar development schemes, and asteroid-mining prospectuses carry with them the class relations, commercial incentives, state power, and inequalities of the societies that launch them. Peter Dickens and James Ormrod's 'sociology of the universe' asks who gets to go, who profits, and whose imaginaries of space are being realized — questions that turn the romance of the final frontier into a study of very familiar earthly arrangements. Lisa Billings sharpens the point for tourism specifically: is space travel exploration for the masses, or joyrides for the ultra-rich? The imagined lunar resort is where that question stops being hypothetical.",
    references: [
      {
        citation:
          "Dickens, P. (2009). \u201cThe Cosmos as Capitalism\u2019s Outside.\u201d The Sociological Review, 57(S1), 66\u201382.",
        url: "https://doi.org/10.1111/j.1467-954X.2009.01817.x",
      },
      {
        citation:
          "Dickens, P., & Ormrod, J. S. (2007). \u201cOuter Space and Internal Nature: Towards a Sociology of the Universe.\u201d Sociology, 41(4), 609\u2013626.",
        url: "https://doi.org/10.1177/0038038507078915",
      },
      {
        citation:
          "Billings, L. (2006). \u201cExploration for the Masses? Or Joyrides for the Ultra-rich? Prospects for Space Tourism.\u201d Space Policy, 22(3), 162\u2013164.",
        url: "https://www.sciencedirect.com/science/article/abs/pii/S0265964606000440",
      },
    ],
  },
  {
    id: "information-action-ratio",
    icon: "Rss",
    title: "Information\u2013Action Ratio",
    academicName: "Information\u2013Action Ratio / Media Ecology",
    cluster: "Information, Media & Attention",
    definition:
      "Modern media vastly expand the quantity and geographic range of the information people receive, without expanding their capacity to act meaningfully on any of it.",
    explanation:
      "Neil Postman introduced the information\u2013action ratio in Amusing Ourselves to Death (1985) to describe a structural feature of the telegraph age and everything after it: news from everywhere, addressed to no one in particular, demanding nothing. The problem is not that we know too much, but that the connection between information and situated action \u2014 context, responsibility, the possibility of response \u2014 has been severed. A citizen saturated with decontextualized headlines can feel simultaneously well-informed and completely powerless. Postman's later media-ecology writing frames this as a question of what information is for: whether an information environment nourishes democratic action and humanistic judgment, or merely fills time. The concept is distinct from information overload \u2014 the issue here is not processing capacity but the broken circuit between knowing and doing. Media ecologists after Postman continue to debate how far the metaphor stretches into the algorithmic era.",
    references: [
      {
        citation:
          "Postman, N. (1985). Amusing Ourselves to Death: Public Discourse in the Age of Show Business. Viking.",
      },
      {
        citation:
          "Postman, N. (2000). \u201cThe Humanism of Media Ecology.\u201d Proceedings of the Media Ecology Association, 1, 10\u201316.",
        url: "https://www.media-ecology.net/publications/MEA_proceedings/v1/postman01.pdf",
      },
      {
        citation:
          "Stephens, N. P. (2014). \u201cToward a More Substantive Media Ecology: Postman\u2019s Metaphor Versus Posthuman Futures.\u201d International Journal of Communication, 8.",
        url: "https://ijoc.org/index.php/ijoc/article/view/2586",
      },
    ],
  },
  {
    id: "virtual-simulation",
    icon: "Cpu",
    title: "The Virtual Simulation",
    academicName: "Simulation Argument / Digital Self-Presentation / Proteus Effect / Context Collapse",
    cluster: "Simulation & Digital Identity",
    definition:
      "Not one theory but three stacked layers: whether experienced reality could itself be simulated; how people construct online personae from symbols and consumption; and how avatars and imagined audiences feed back into real behavior.",
    explanation:
      "The 'virtual' question splits into distinct research traditions that are often blurred together. At the ontological layer, Nick Bostrom's simulation argument treats 'are we living in a computer simulation?' as a serious probabilistic claim rather than science fiction. At the layer of self-presentation, consumer researchers Schau and Gilly show how people assemble digital selves from brands, places, objects, and cultural references \u2014 identity as curation. At the behavioral layer, Yee and Bailenson's Proteus Effect demonstrates experimentally that the characteristics of one's avatar alter one's conduct: people given taller or more attractive virtual bodies negotiate and disclose differently. Marwick and boyd add the social architecture: on platforms, previously separate audiences \u2014 family, colleagues, strangers \u2014 collapse into one imagined viewer, forcing a single performed self where many contextual selves used to live. Together these describe a world where the simulated and the lived are no longer cleanly separable.",
    references: [
      {
        citation:
          "Bostrom, N. (2003). \u201cAre You Living in a Computer Simulation?\u201d The Philosophical Quarterly, 53(211), 243\u2013255.",
        url: "https://doi.org/10.1111/1467-9213.00309",
      },
      {
        citation:
          "Yee, N., & Bailenson, J. (2007). \u201cThe Proteus Effect: The Effect of Transformed Self-Representation on Behavior.\u201d Human Communication Research, 33(3), 271\u2013290.",
        url: "https://doi.org/10.1111/j.1468-2958.2007.00299.x",
      },
      {
        citation:
          "Schau, H. J., & Gilly, M. C. (2003). \u201cWe Are What We Post? Self-Presentation in Personal Web Space.\u201d Journal of Consumer Research, 30(3), 385\u2013404.",
        url: "https://doi.org/10.1086/378616",
      },
      {
        citation:
          "Marwick, A. E., & boyd, d. (2011). \u201cI Tweet Honestly, I Tweet Passionately: Twitter Users, Context Collapse, and the Imagined Audience.\u201d New Media & Society, 13(1), 114\u2013133.",
        url: "https://doi.org/10.1177/1461444810365313",
      },
    ],
  },
  {
    id: "cognitive-estrangement",
    icon: "Telescope",
    title: "Cognitive Estrangement",
    academicName: "Cognitive Estrangement / Novum",
    cluster: "Science Fiction as Critique",
    definition:
      "Science fiction installs a strange but rationally intelligible new thing \u2014 a novum \u2014 that suspends the reader's habitual acceptance of the existing order and makes naturalized power relations visible again.",
    explanation:
      "Darko Suvin's foundational account defines science fiction not by rockets or aliens but by a cognitive operation. A novum \u2014 a new device, institution, or world logically worked through \u2014 estranges the reader from the present without abandoning rational explanation, which distinguishes SF from fantasy. The payoff is critical: things a society treats as natural and inevitable (its hierarchies, its economies, its common sense) reappear as contingent choices when viewed from the vantage of the invented world. A lunar hotel, a simulated city, or a fully reviewed society are in this sense instruments: each estranges some feature of the reader's own world precisely by exaggerating it into a functioning system elsewhere. Later Marxist critics such as Renault probed both the power and the limits of the method \u2014 asking when estrangement genuinely produces critique, and when it merely produces novelty for the culture industry to absorb.",
    references: [
      {
        citation:
          "Suvin, D. (1972). \u201cOn the Poetics of the Science Fiction Genre.\u201d College English, 34(3), 372\u2013382.",
        url: "https://www.jstor.org/stable/375141",
      },
      {
        citation:
          "Renault, G. (1980). \u201cScience Fiction as Cognitive Estrangement: Darko Suvin and the Marxist Critique of Mass Culture.\u201d Discourse, 2, 113\u2013141.",
        url: "https://www.jstor.org/stable/41389056",
      },
    ],
  },
  {
    id: "gentrification",
    icon: "Building2",
    title: "Gentrification & the Production of Space",
    academicName: "Gentrification / Rent-Gap Theory / Capital-Led Spatial Restructuring",
    cluster: "Capital, Space & Consumption",
    definition:
      "Rent-gap theory explains gentrification not as taste or migration but as capital discovering the gap between what land currently earns and what it could earn \u2014 then reorganizing space and displacing people to close it.",
    explanation:
      "Neil Smith's 1979 intervention reversed the standard story of gentrification. Where earlier accounts emphasized the preferences of incoming middle-class residents \u2014 a 'back to the city' movement of people \u2014 Smith showed a back-to-the-city movement of capital. Disinvestment in a neighborhood depresses actual ground rent while potential rent (given 'higher' uses) keeps rising; when the gap grows wide enough, redevelopment becomes profitable and investment floods back, with renovation, rebranding, and population replacement following the money. The framework travels well beyond housing: any devalued space \u2014 a declining resort, an abandoned landmark, even an unexploited frontier \u2014 can be read through the rent gap, as capital scans for undervalued territory to reorganize. What looks like aesthetic revival or neighborhood 'improvement' is, on this account, a spatial expression of investment logic, with its costs borne by whoever occupied the space during its devalued years.",
    references: [
      {
        citation:
          "Smith, N. (1979). \u201cToward a Theory of Gentrification: A Back to the City Movement by Capital, Not People.\u201d Journal of the American Planning Association, 45(4), 538\u2013548.",
        url: "https://doi.org/10.1080/01944367908977002",
      },
    ],
  },
  {
    id: "platform-valuation",
    icon: "Star",
    title: "Platform Valuation",
    academicName: "Apparatuses of Valuation / Online Evaluation / Platformized Reputation",
    cluster: "Capital, Space & Consumption",
    definition:
      "Online ratings are not passive records of quality. Platforms actively define what counts as valuable through metrics, rankings, reviews, and visibility rules \u2014 and reshape work, judgment, and resource allocation accordingly.",
    explanation:
      "Orlikowski and Scott's study of online travel evaluation shows what happens when the apparatus of judgment moves from professional inspectors to platform infrastructure. A hotel once assessed periodically by trained evaluators against published criteria is now assessed continuously by anonymous crowds whose verdicts are aggregated, ranked, and displayed by algorithms the hotel cannot see. The consequences run deeper than reputation: staff routines, managerial attention, pricing, and investment all reorganize around the metrics. Valuation, in their terms, is an apparatus \u2014 a sociomaterial arrangement that does not merely measure value but produces it, deciding which qualities become visible and consequential at all. The framework generalizes to any scored existence: restaurants, drivers, freelancers, hosts, and arguably persons, wherever a rating regime determines access to visibility and income. To live inside such an apparatus is to feel evaluation not as an event but as a permanent ambient condition.",
    references: [
      {
        citation:
          "Orlikowski, W. J., & Scott, S. V. (2014). \u201cWhat Happens When Evaluation Goes Online? Exploring Apparatuses of Valuation in the Travel Sector.\u201d Organization Science, 25(3), 868\u2013891.",
        url: "https://dspace.mit.edu/entities/publication/e2798274-f62f-482f-98c1-0b03d79deb61",
      },
    ],
  },
  {
    id: "post-truth",
    icon: "ShieldAlert",
    title: "Post-Truth & Epistemic Instability",
    academicName: "Post-Truth / Misinformation / Epistemic Instability",
    cluster: "Truth, Knowledge & Public Reality",
    definition:
      "Post-truth is not merely the presence of false statements but the erosion of shared, stable mechanisms for a public to determine facts \u2014 with emotion, group identity, and repetition often outweighing evidence.",
    explanation:
      "Cognitive research on misinformation reveals why corrections so often fail. Lewandowsky and colleagues document the continued influence effect: information tagged as false keeps shaping memory and inference long after retraction, because a discredited claim still occupies the causal slot in a person's mental model until something equally coherent replaces it. Repetition breeds familiarity, familiarity breeds truth-feeling; identity-congruent claims are absorbed with less scrutiny than identity-threatening ones. Their later 'post-truth' work scales the diagnosis from individual cognition to information ecosystems: when platforms reward engagement over accuracy and fragment audiences into congenial enclaves, a society can lose not just particular truths but the shared machinery for establishing any truth. Epistemic instability names that second-order loss \u2014 disagreement not about answers but about what could even count as evidence. The literature's sobering contribution is that this condition is cognitively comfortable, which is precisely what sustains it.",
    references: [
      {
        citation:
          "Lewandowsky, S., Ecker, U. K. H., & Cook, J. (2017). \u201cBeyond Misinformation: Understanding and Coping with the \u2018Post-Truth\u2019 Era.\u201d Journal of Applied Research in Memory and Cognition, 6(4), 353\u2013369.",
        url: "https://doi.org/10.1016/j.jarmac.2017.07.008",
      },
      {
        citation:
          "Lewandowsky, S., Ecker, U. K. H., Seifert, C. M., Schwarz, N., & Cook, J. (2012). \u201cMisinformation and Its Correction: Continued Influence and Successful Debiasing.\u201d Psychological Science in the Public Interest, 13(3), 106\u2013131.",
        url: "https://doi.org/10.1177/1529100612451018",
      },
    ],
  },
  {
    id: "mediatization",
    icon: "RadioTower",
    title: "Mediatization",
    academicName: "Mediatization of Society / Mediatization of Politics and Religion",
    cluster: "Information, Media & Attention",
    definition:
      "Mediatization is not 'being covered by the media' but the deeper process by which politics, religion, and other institutions reorganize themselves around media formats, rhythms, visibility demands, and commercial logic.",
    explanation:
      "Stig Hjarvard's institutionalist theory distinguishes mediation \u2014 communication passing through media \u2014 from mediatization, a long-run structural change in which social institutions internalize media logic as their own operating logic. A mediatized politics selects leaders for telegenic performance, times decisions to news cycles, and treats governance partly as content production. Hjarvard's striking extension is to religion: sacred narratives, authority, and ritual increasingly reach people through entertainment media and journalism, which repackage them by their own criteria \u2014 drama, personalization, spectacle \u2014 so that media become active agents of religious change rather than neutral channels. The theory gives a name to a pervasive modern texture: institutions that seem to exist most fully in their broadcast form, personae engineered for the formats that carry them, and the quiet migration of authority from pulpits, parliaments, and stages to whatever medium currently commands the audience.",
    references: [
      {
        citation:
          "Hjarvard, S. (2008). \u201cThe Mediatization of Society: A Theory of the Media as Agents of Social and Cultural Change.\u201d Nordicom Review, 29(2), 105\u2013134.",
        url: "https://researchprofiles.ku.dk/en/publications/the-mediatization-of-society-a-theory-of-the-media-as-agents-of-s/",
      },
      {
        citation:
          "Hjarvard, S. (2008). \u201cThe Mediatization of Religion: A Theory of the Media as Agents of Religious Change.\u201d Northern Lights, 6(1), 9\u201326.",
        url: "https://doi.org/10.1386/nl.6.1.9_1",
      },
    ],
  },
  {
    id: "commodified-authenticity",
    icon: "BadgeCheck",
    title: "Commodification of Authenticity",
    academicName: "Brand Authenticity / Commodification of Authenticity",
    cluster: "Capital, Space & Consumption",
    definition:
      "Qualities like 'realness', sincerity, independence, and incorruptibility can be engineered into recognizable, communicable, consumable brand attributes \u2014 making authenticity itself a commercial resource.",
    explanation:
      "Beverland's study of luxury wineries documents the paradox with unusual candor: firms deliberately craft an appearance of being above commercial considerations \u2014 downplaying marketing, foregrounding heritage, place, and craft \u2014 precisely because that appearance commands a premium. Authenticity here is not the absence of strategy but a particularly sophisticated strategy, one that must conceal its own production to work. S\u00f6dergren's review of twenty-five years of research shows the concept's reach across consumer culture: authenticity judged variously as historical faithfulness, sincerity of intent, or congruence with the consumer's own identity, and manufactured accordingly. Banet-Weiser widens the lens from brands to persons: in a brand culture, individuals too package their politics, creativity, and selfhood as authentic content, and the ambivalence is genuine \u2014 the feelings are real even as they circulate as market value. The framework explains a familiar modern vertigo: the more loudly something announces its realness, the more constructed that realness may be.",
    references: [
      {
        citation:
          "Beverland, M. B. (2005). \u201cCrafting Brand Authenticity: The Case of Luxury Wines.\u201d Journal of Management Studies, 42(5), 1003\u20131029.",
        url: "https://doi.org/10.1111/j.1467-6486.2005.00530.x",
      },
      {
        citation:
          "S\u00f6dergren, J. (2021). \u201cBrand Authenticity: 25 Years of Research.\u201d International Journal of Consumer Studies, 45(4), 645\u2013663.",
        url: "https://doi.org/10.1111/ijcs.12651",
      },
      {
        citation:
          "Banet-Weiser, S. (2012). Authentic\u2122: The Politics of Ambivalence in a Brand Culture. New York University Press.",
        url: "https://nyupress.org/9780814787144/authentic/",
      },
    ],
  },
  {
    id: "attention-economy",
    icon: "Hourglass",
    title: "Attention Economy & Information Overload",
    academicName: "Attention Scarcity / Attention Economy / Information Overload",
    cluster: "Information, Media & Attention",
    definition:
      "In an information-rich world the scarce resource is no longer information but human attention and processing capacity; when informational demand exceeds cognitive supply, judgment, decision-making, and the capacity to act all degrade.",
    explanation:
      "Herbert Simon's 1971 formulation remains the field's cornerstone: a wealth of information creates a poverty of attention, and rational design must therefore allocate attention efficiently among the overabundance of sources that might consume it. Everything now called the attention economy \u2014 engagement metrics, feed algorithms, notification design \u2014 is an industrial elaboration of that insight, competing to capture the one genuinely finite input. The overload literature maps the costs on the receiving end. Eppler and Mengis's cross-disciplinary review finds a recurring inverted-U: information improves decisions up to a threshold, beyond which accuracy declines while confidence often does not, accompanied by fatigue, avoidance, delay, and arbitrary filtering. Roetzel's later synthesis extends the framework across individual and organizational levels in the platform era. The two traditions bracket the same predicament: an environment engineered to maximize the very input whose excess demonstrably degrades the person consuming it.",
    references: [
      {
        citation:
          "Simon, H. A. (1971). \u201cDesigning Organizations for an Information-Rich World.\u201d In M. Greenberger (Ed.), Computers, Communications, and the Public Interest (pp. 37\u201372). Johns Hopkins Press.",
        url: "https://atelierdesfuturs.org/wp-content/uploads/2025/07/1971-simon.pdf",
      },
      {
        citation:
          "Eppler, M. J., & Mengis, J. (2004). \u201cThe Concept of Information Overload: A Review of Literature from Organization Science, Accounting, Marketing, MIS, and Related Disciplines.\u201d The Information Society, 20(5), 325\u2013344.",
        url: "https://doi.org/10.1080/01972240490507974",
      },
      {
        citation:
          "Roetzel, P. G. (2019). \u201cInformation Overload in the Information Age: A Review of the Literature from Business Administration, Business Psychology, and Related Disciplines with a Bibliometric Approach and Framework Development.\u201d Business Research, 12, 479\u2013522.",
        url: "https://doi.org/10.1007/s40685-018-0069-z",
      },
    ],
  },
];
