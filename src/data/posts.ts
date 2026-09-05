import type { Background, Post, ShaderId, Treatment } from "./types";

const photo = (id: number, treatment: Treatment, credit: string): Background => ({
  type: "photo",
  id,
  treatment,
  credit,
});

const shader = (s: ShaderId, seed: number): Background => ({
  type: "shader",
  shader: s,
  seed,
});

const TAGS_BASE = "#Desco #Bauru #InteriorPaulista #Branding #Estratégia #DesignBrasileiro";

export const postsData: Post[] = [
  // ───────────────────────────── 01 · MANIFESTO ─────────────────────────────
  {
    id: 1,
    slug: "ponto-de-vista",
    pillar: "manifesto",
    archetype: "brutalist",
    theme: "dark",
    tag: "MANIFESTO / 01",
    headline: "Marcas não precisam de mais *barulho*.",
    subheadline: "Precisam de um ponto de vista.",
    meta: { client: "Desco", discipline: "Manifesto", year: "2015—" },
    caption: `Marcas não precisam de mais barulho.

Todo dia, o feed recebe mais um post, mais um filme, mais um "conteúdo relevante". E quase nada disso muda a forma como alguém vê a marca no dia seguinte.

O que falta não é volume. É posição. Uma frase que a marca defende — e, principalmente, aquilo que ela se recusa a ser.

A Desco existe para isso: estratégia como argumento, design como evidência, campanha como o instante em que os dois se tornam inevitáveis.

Se a sua marca está fazendo barulho e ninguém está ouvindo, o problema não é o volume.

→ Escreva o que está travando a marca. Respondemos com uma pergunta melhor.

${TAGS_BASE} #PontoDeVista #Manifesto #RupturaVisual #Posicionamento`,
    imagePrompt:
      "Monumental brutalist concrete facade shot from a low angle, harsh single-source sunlight carving deep geometric shadows, raw board-formed concrete texture, a lone tiny human figure for scale at the base, overcast sky replaced by pure black, editorial architecture photography, shot on Hasselblad X2D with 35mm f/8, extremely sharp, high micro-contrast, monochrome with a single acid-green (#d4ff00) light leak on the right edge, grain of Kodak Tri-X pushed to 1600, --ar 4:5 --style raw --v 6",
    background: photo(29797868, "duotone", "Darya Sannikova / Pexels"),
  },
  {
    id: 2,
    slug: "feio-com-intencao",
    pillar: "manifesto",
    archetype: "kinetic",
    theme: "dark",
    tag: "REGRA 03 / FILOSOFIA OPERACIONAL",
    headline: "Feio com *intenção* supera bonito sem.",
    subheadline: "Preferimos o desconforto que se lembra ao conforto que se esquece.",
    meta: { client: "Desco", discipline: "Filosofia", year: "Regra 03" },
    caption: `Feio com intenção supera bonito sem.

Bonito é fácil. Existe template, existe referência, existe IA. O que não existe em prateleira é a decisão de incomodar de propósito — na hora certa, pelo motivo certo.

Tensão é ferramenta, não acidente. Uma tipografia que arranha, uma cor que não pede licença, um enquadramento que erra por escolha. Isso fica. O resto rola.

Regra número três da nossa filosofia operacional. Não é estética. É critério.

→ Qual foi a última vez que a sua marca escolheu incomodar?

${TAGS_BASE} #FeioComIntencao #Tensão #DesignComOpinião #Kinetic`,
    imagePrompt:
      "Abstract liquid gradient surface, viscous black oil slowly folding into itself with thin acid-green (#d4ff00) veins glowing from within, macro 3D render, subsurface scattering, caustic reflections, extremely shallow depth of field, octane render, dark studio environment, volumetric haze, cinematic top light, 8k, hyper-detailed, --ar 4:5 --style raw --v 6",
    background: shader("liquid", 11),
  },
  {
    id: 3,
    slug: "tese-antes-do-pixel",
    pillar: "manifesto",
    archetype: "stat",
    theme: "dark",
    tag: "REGRA 02 / FILOSOFIA OPERACIONAL",
    headline: "Primeiro a *tese*, depois a estética.",
    subheadline: "Antes de qualquer pixel, uma frase que a marca defende.",
    stat: { value: "01", label: "TESE ANTES DE QUALQUER PIXEL" },
    meta: { client: "Desco", discipline: "Filosofia", year: "Regra 02" },
    caption: `Uma tese. Depois, tudo o mais.

Existe uma ordem que quase ninguém respeita: primeiro se define o que a marca defende — e o que ela se recusa a ser. Só depois se abre o software.

Quando a ordem inverte, o resultado é sempre o mesmo: layouts bonitos defendendo nada. Campanhas que poderiam ser de qualquer concorrente. Identidades que sobrevivem até o próximo diretor de marketing.

Na Desco, nenhuma decisão visual acontece sem responder a uma pergunta estratégica feita antes.

→ Se a sua marca tivesse que caber em uma frase, qual seria?

${TAGS_BASE} #TeseAntesDoPixel #EstratégiaDeMarca #DesignEstratégico`,
    imagePrompt:
      "Dark gradient mesh background, soft overlapping spheres of light in charcoal grey and deep moss green dissolving into black, one precise thin acid-green horizon line, minimal, generative art aesthetic, ultra-smooth 16-bit gradients, no noise, no text, rendered in Blender with Cycles, physically accurate volumetric fog, --ar 4:5 --style raw --v 6",
    background: shader("mesh", 23),
  },
  {
    id: 4,
    slug: "briefing-e-hipotese",
    pillar: "manifesto",
    archetype: "minimal",
    theme: "paper",
    tag: "REGRA 01 / FILOSOFIA OPERACIONAL",
    headline: "Um briefing é uma *hipótese*.",
    subheadline:
      "Recebemos o pedido, testamos a premissa e devolvemos a pergunta certa.",
    meta: { client: "Desco", discipline: "Filosofia", year: "Regra 01" },
    caption: `Um briefing é uma hipótese. Não uma ordem de serviço.

Quando um cliente chega pedindo "uma campanha", a primeira coisa que fazemos não é abrir o Figma. É testar a premissa. Às vezes o problema não era a campanha — era o produto, o preço, o canal, a promessa.

Devolver a pergunta certa é a parte mais valiosa do trabalho. E a mais desconfortável.

Regra número um. Todas as outras derivam dela.

→ Qual pergunta ninguém fez sobre a sua marca ainda?

${TAGS_BASE} #Briefing #Hipótese #MétodoDesco #Diagnóstico`,
    imagePrompt:
      "Minimalist black and white photograph of a monolithic brutalist building facade with repetitive concrete modules, extreme symmetry, shot straight-on with a tilt-shift lens, Canon TS-E 24mm, f/11, flat soft overcast lighting, fine art architectural photography in the style of Hélène Binet, paper-like tonal range with soft blacks, subtle film grain, --ar 4:5 --style raw --v 6",
    background: photo(32466579, "mono", "Tomás Asurmendi / Pexels"),
  },
  {
    id: 5,
    slug: "quatro-regras",
    pillar: "manifesto",
    archetype: "carousel",
    theme: "dark",
    tag: "FILOSOFIA OPERACIONAL / 04",
    headline: "Quatro regras que valem mais que qualquer *processo*.",
    subheadline: "Deslize. Nenhuma delas cabe em slide de agência.",
    slides: [
      {
        kicker: "FILOSOFIA OPERACIONAL",
        headline: "Quatro regras que valem mais que qualquer *processo*.",
        body: "Nenhuma delas foi desenhada em slide. Todas foram aprendidas errando em público.",
      },
      {
        kicker: "REGRA 01",
        headline: "Um briefing é uma *hipótese*.",
        body: "Recebemos o pedido, testamos a premissa e devolvemos a pergunta certa. Às vezes o problema não era a campanha.",
      },
      {
        kicker: "REGRA 02",
        headline: "Primeiro a tese, depois a *estética*.",
        body: "Beleza sem argumento é decoração. Cada decisão visual responde a uma pergunta estratégica feita antes.",
      },
      {
        kicker: "REGRA 03",
        headline: "Feio com intenção supera *bonito sem*.",
        body: "Preferimos o desconforto que se lembra ao conforto que se esquece. Tensão é ferramenta, não acidente.",
      },
      {
        kicker: "REGRA 04",
        headline: "Interior não é *periferia*.",
        body: "Operamos de Bauru por escolha. A distância dos centros é o que nos permite ver o óbvio antes dele virar tendência.",
      },
    ],
    meta: { client: "Desco", discipline: "Filosofia", year: "01—04" },
    caption: `Quatro regras. Zero processo em slide.

01 — Um briefing é uma hipótese.
02 — Primeiro a tese, depois a estética.
03 — Feio com intenção supera bonito sem.
04 — Interior não é periferia.

Não são valores de parede. São critérios de decisão. Cada projeto que sai daqui passou por esse filtro — e alguns não passaram.

Deslize para ler cada uma delas. Depois nos diga qual é a mais difícil de aplicar na sua marca.

→ Salve para reler quando o próximo briefing chegar.

${TAGS_BASE} #FilosofiaOperacional #QuatroRegras #Carrossel #MétodoDesco`,
    imagePrompt:
      "Ultra-wide panoramic photograph of a modernist concrete building with an endless rhythm of vertical fins, shot at dusk with mixed tungsten and cold ambient light, long horizontal composition designed to be split into five vertical frames, cinematic anamorphic lens flare, Panavision C-series 40mm, deep blacks, restrained desaturated palette, --ar 21:9 --style raw --v 6",
    background: photo(31711526, "mono", "Sami Raad / Pexels"),
  },
  {
    id: 6,
    slug: "desconforto-que-se-lembra",
    pillar: "manifesto",
    archetype: "split",
    theme: "dark",
    tag: "MANIFESTO / TENSÃO",
    headline: "Preferimos o desconforto que se *lembra*.",
    subheadline: "Ao conforto que se esquece.",
    meta: { client: "Desco", discipline: "Manifesto", year: "2025" },
    caption: `Conforto se esquece. Desconforto se lembra.

Toda marca quer ser lembrada, mas quase nenhuma aceita o preço: sair do lugar seguro. O layout aprovado por unanimidade raramente é o layout que alguém vai citar em uma conversa.

Não estamos falando de chocar por chocar. Estamos falando de tensão com propósito — a distância exata entre o que o público espera e o que ele recebe.

Essa distância é o nosso material de trabalho.

→ Comente: qual marca te incomodou de um jeito bom recentemente?

${TAGS_BASE} #Tensão #Memorável #DesignComPropósito #SplitScreen`,
    imagePrompt:
      "Dramatic black and white studio portrait of a woman, half of her face swallowed by hard shadow, single bare bulb key light at 90 degrees, skin texture visible, direct confrontational gaze, shot on Leica M11 Monochrom with 50mm Summilux f/1.4, extreme contrast, Richard Avedon meets Peter Lindbergh, pure black background, --ar 4:5 --style raw --v 6",
    background: photo(37719870, "mono", "Mario Spencer / Pexels"),
  },
  {
    id: 7,
    slug: "interior-nao-e-periferia",
    pillar: "manifesto",
    archetype: "brutalist",
    theme: "dark",
    tag: "REGRA 04 / FILOSOFIA OPERACIONAL",
    headline: "Interior não é *periferia*.",
    subheadline: "Operamos de Bauru por escolha, não por falta de opção.",
    meta: { client: "Desco", discipline: "Filosofia", year: "Regra 04" },
    caption: `Interior não é periferia.

Existe uma ideia preguiçosa de que pensamento de marca acontece em três bairros de duas capitais. Fazemos questão de provar o contrário, todos os dias, a partir de Bauru.

A distância dos centros não é limitação. É o que nos permite ver o óbvio antes dele virar tendência — e ignorar a tendência quando ela não serve ao cliente.

Dez anos operando daqui. Para marcas que decidiram parecer com o que são.

→ Se você constrói marca fora do eixo, levanta a mão. A gente quer conhecer.

${TAGS_BASE} #InteriorNãoÉPeriferia #ForaDoEixo #Bauru #Regra04`,
    imagePrompt:
      "Abstract topographic contour map rendered as thin glowing acid-green lines over pure black, lines warping like liquid terrain, generative art, precise vector-like strokes with slight chromatic aberration, wireframe landscape inspired by Joy Division Unknown Pleasures and cartographic plates, no text, ultra clean, --ar 4:5 --style raw --v 6",
    background: shader("grid", 7),
  },
  {
    id: 8,
    slug: "argumento-e-evidencia",
    pillar: "manifesto",
    archetype: "kinetic",
    theme: "dark",
    tag: "MANIFESTO / MÉTODO",
    headline: "Estratégia como argumento. Design como *evidência*.",
    subheadline: "A campanha é o instante em que os dois se tornam inevitáveis.",
    meta: { client: "Desco", discipline: "Manifesto", year: "2025" },
    caption: `Estratégia é o argumento. Design é a evidência.

Um sem o outro não convence ninguém. Estratégia sem design é um PDF que ninguém abre. Design sem estratégia é decoração cara.

A campanha é o momento em que os dois se encontram — e ficam inevitáveis. Quando a frase e a imagem chegam juntas, o público não discute: ele reconhece.

É assim que a Desco trata cada projeto. Sem exceção.

→ Marque alguém que ainda acha que estratégia e criação são departamentos separados.

${TAGS_BASE} #Argumento #Evidência #EstratégiaECriação #Motion`,
    imagePrompt:
      "Weathered concrete facade with geometric window grid, extreme high-contrast duotone treatment in black and acid green (#d4ff00), halftone texture visible, shot with a 85mm lens compressing the perspective, harsh midday sun, poster-like graphic quality, risograph print aesthetic, --ar 4:5 --style raw --v 6",
    background: photo(5472762, "duotone", "Adrien Olichon / Pexels"),
  },

  // ─────────────────────────── 02 · ESTRATÉGIA ──────────────────────────────
  {
    id: 9,
    slug: "antes-de-qualquer-pixel",
    pillar: "estrategia",
    archetype: "brutalist",
    theme: "dark",
    tag: "DISCIPLINA / ESTRATÉGIA & POSICIONAMENTO",
    headline: "Antes de qualquer pixel, uma *tese*.",
    subheadline: "Definimos o que a marca defende — e o que ela se recusa a ser.",
    meta: { client: "Disciplina", discipline: "Diagnóstico · Plataforma · Arquitetura", year: "01" },
    caption: `Antes de qualquer pixel, uma tese.

Estratégia & Posicionamento é a primeira disciplina da Desco — e a única sem a qual as outras não funcionam de verdade.

O que entregamos: diagnóstico honesto, plataforma de marca e arquitetura de portfólio. O que não entregamos: um deck de 80 slides que ninguém vai reler.

A tese cabe em uma frase. Se não cabe, ainda não está pronta.

→ Quer testar a tese da sua marca? Manda a frase. Devolvemos a pergunta.

${TAGS_BASE} #Posicionamento #PlataformaDeMarca #ArquiteturaDeMarca #Tese`,
    imagePrompt:
      "Brutalist residential tower with cascading concrete balconies overflowing with dark green vegetation, shot from below against a pitch-black sky, dramatic side lighting at golden hour turned monochrome, extremely detailed concrete texture, Sony A7R V with 24mm f/5.6, architectural editorial, deep shadows, --ar 4:5 --style raw --v 6",
    background: photo(29678493, "mono", "Evan Hughes / Pexels"),
  },
  {
    id: 10,
    slug: "dez-anos",
    pillar: "estrategia",
    archetype: "stat",
    theme: "dark",
    tag: "DADO / OPERAÇÃO CONTÍNUA",
    headline: "Dez anos operando a partir de *Bauru*.",
    subheadline: "Para marcas que decidiram parecer com o que são.",
    stat: { value: "10", label: "ANOS DE OPERAÇÃO CONTÍNUA" },
    meta: { client: "Desco", discipline: "Dado", year: "2015—2025" },
    caption: `Dez anos. Uma cidade. Um critério.

Desde 2015, a Desco opera a partir de Bauru para marcas de tintas, alimentos, energia, futebol, educação e imobiliário. Setores diferentes, sempre a mesma exigência: coragem para parecer com o que são — e não com o que o mercado espera.

Dez anos não é comemoração. É evidência de método.

→ Conhece uma marca que precisa de coragem? Marca ela aqui.

${TAGS_BASE} #DezAnos #OperaçãoContínua #Est2015 #BigStat`,
    imagePrompt:
      "Iconic brutalist concrete church with angular geometric volumes against a black sky, snow-covered mountain setting turned dark and moody, strong directional light revealing raw concrete grain, monochromatic, ultra-sharp large format look, Phase One IQ4 150MP, 55mm, f/11, --ar 4:5 --style raw --v 6",
    background: photo(18272058, "mono", "Adrien Olichon / Pexels"),
  },
  {
    id: 11,
    slug: "o-que-se-recusa-a-ser",
    pillar: "estrategia",
    archetype: "split",
    theme: "dark",
    tag: "ESTRATÉGIA / NEGATIVO DA MARCA",
    headline: "O que a marca se *recusa* a ser.",
    subheadline: "É mais importante do que aquilo que ela diz que é.",
    meta: { client: "Método", discipline: "Plataforma de marca", year: "2025" },
    caption: `Toda marca sabe dizer o que é. Poucas sabem dizer o que se recusam a ser.

E é exatamente aí que mora a posição. "Inovadora", "humana", "próxima" — qualquer concorrente pode reivindicar. Agora, "nunca vamos usar banco de imagem", "nunca vamos falar como um banco", "nunca vamos fazer promoção de Black Friday" — isso define território.

O negativo da marca é o que dá contorno ao positivo.

→ Complete nos comentários: a minha marca se recusa a ser ______.

${TAGS_BASE} #NegativoDaMarca #Posicionamento #Território #CaseStudy`,
    imagePrompt:
      "Moody side-profile portrait of a man in his 30s, chiaroscuro lighting with a single warm rim light tracing the silhouette, rest of the face in deep shadow, dark grey seamless background, fine skin texture, shot on Hasselblad 907X with 80mm f/2.8, cinematic color grade with desaturated greens, --ar 4:5 --style raw --v 6",
    background: photo(35964824, "color", "Eric Moura / Pexels"),
  },
  {
    id: 12,
    slug: "pergunta-certa",
    pillar: "estrategia",
    archetype: "minimal",
    theme: "dark",
    tag: "ESTRATÉGIA / DIAGNÓSTICO",
    headline: "Recebemos o pedido. Devolvemos a *pergunta certa*.",
    subheadline: "Sem formulário. Sem funil.",
    meta: { client: "Método", discipline: "Diagnóstico", year: "Etapa 01" },
    caption: `Recebemos o pedido. Devolvemos a pergunta certa.

O diagnóstico é a etapa mais barata e mais ignorada de qualquer projeto de marca. Barata porque custa uma conversa honesta. Ignorada porque a resposta pode ser "você não precisa de uma campanha".

Preferimos perder um job a entregar a coisa errada bem feita.

→ Escreva o que está travando a marca. Sem formulário, sem funil.

${TAGS_BASE} #Diagnóstico #PerguntaCerta #SemFunil #MinimalPoster`,
    imagePrompt:
      "Slow vertical aurora-like bands of light in deep forest green and near-black, subtle acid-green highlights, silky long-exposure feel, abstract digital painting with ultra-smooth gradients, minimal composition with vast negative space in the lower half, no stars, no horizon, --ar 4:5 --style raw --v 6",
    background: shader("aurora", 31),
  },
  {
    id: 13,
    slug: "diagnostico-plataforma-arquitetura",
    pillar: "estrategia",
    archetype: "carousel",
    theme: "dark",
    tag: "ESTRATÉGIA / MÉTODO EM 3 ETAPAS",
    headline: "Diagnóstico. Plataforma. *Arquitetura*.",
    subheadline: "As três etapas de uma tese de marca.",
    slides: [
      {
        kicker: "ESTRATÉGIA & POSICIONAMENTO",
        headline: "Diagnóstico. Plataforma. *Arquitetura*.",
        body: "As três etapas que transformam um pedido em uma tese. Deslize.",
      },
      {
        kicker: "ETAPA 01 / DIAGNÓSTICO",
        headline: "O que está *realmente* travando a marca.",
        body: "Entrevistas, dados, campo. Testamos a premissa do briefing antes de aceitá-la.",
      },
      {
        kicker: "ETAPA 02 / PLATAFORMA",
        headline: "Uma frase que a marca *defende*.",
        body: "Tese, tom, território e o que ela se recusa a ser. Repetível, teimosa, impossível de confundir.",
      },
      {
        kicker: "ETAPA 03 / ARQUITETURA",
        headline: "Como o portfólio se *organiza* em torno da tese.",
        body: "Marcas, linhas e produtos com hierarquia clara. Nada sobrevive sem a etapa anterior.",
      },
    ],
    meta: { client: "Método", discipline: "Estratégia", year: "3 etapas" },
    caption: `Diagnóstico → Plataforma → Arquitetura.

Três etapas, uma ordem. Pular qualquer uma delas custa caro depois — geralmente na forma de uma campanha que precisa "explicar" a marca.

01 — Diagnóstico: o que está realmente travando.
02 — Plataforma: a frase que a marca defende.
03 — Arquitetura: como o portfólio se organiza em torno dela.

Deslize para ver cada etapa.

→ Salve este carrossel para o próximo planejamento.

${TAGS_BASE} #MétodoDesco #Diagnóstico #Plataforma #Arquitetura #Carrossel`,
    imagePrompt:
      "Seamless panoramic liquid gradient, black ink and dark emerald folding horizontally with thin acid-green filaments, designed as a continuous strip to be sliced into four vertical frames, macro fluid simulation render, Houdini FLIP, glossy subsurface, --ar 21:9 --style raw --v 6",
    background: shader("liquid", 42),
  },
  {
    id: 14,
    slug: "problema-nao-era-a-campanha",
    pillar: "estrategia",
    archetype: "kinetic",
    theme: "dark",
    tag: "ESTRATÉGIA / VERDADE INCÔMODA",
    headline: "Às vezes o problema não era a *campanha*.",
    subheadline: "Era o produto. O preço. A promessa.",
    meta: { client: "Método", discipline: "Diagnóstico", year: "2025" },
    caption: `Às vezes o problema não era a campanha.

Era o produto que não entrega. O preço que não fecha. A promessa que ninguém consegue cumprir na ponta.

Campanha não conserta isso. Campanha amplifica isso. E ampliar um problema é a forma mais cara de descobri-lo.

Por isso testamos a premissa antes de aceitar o job. Mesmo quando isso significa dizer não.

→ Já viu uma campanha ótima naufragar por um problema que não era dela? Conta.

${TAGS_BASE} #VerdadeIncômoda #Diagnóstico #ProdutoAntesDaCampanha #Kinetic`,
    imagePrompt:
      "Dark gradient mesh with slowly drifting soft spheres of light, charcoal, graphite and deep olive, a single sharp acid-green ellipse, ultra-smooth, minimal, generative art, 32-bit float gradients without banding, --ar 4:5 --style raw --v 6",
    background: shader("mesh", 58),
  },
  {
    id: 15,
    slug: "zero-pacotes",
    pillar: "estrategia",
    archetype: "stat",
    theme: "dark",
    tag: "DADO / MODELO OPERACIONAL",
    headline: "Não vendemos pacotes.",
    subheadline: "Montamos a equipe que o problema exige e desmontamos quando ele acaba.",
    stat: { value: "0", label: "PACOTES VENDIDOS EM DEZ ANOS" },
    meta: { client: "Desco", discipline: "Modelo", year: "2015—" },
    caption: `Zero pacotes vendidos em dez anos.

Não existe "plano prata" na Desco. Existe o problema, a equipe que ele exige e o tempo que ele leva. Depois, a equipe se desmonta e vai resolver outra coisa.

Isso torna cada proposta mais trabalhosa. E cada entrega mais honesta.

→ Descreva o problema. Montamos a equipe.

${TAGS_BASE} #ZeroPacotes #ModeloOperacional #SobMedida #BigStat`,
    imagePrompt:
      "Precise glowing wireframe grid deformed by an invisible gravitational field, acid-green lines on pure black, extreme perspective, technical drawing meets generative art, subtle bloom, no text, --ar 4:5 --style raw --v 6",
    background: shader("grid", 64),
  },

  // ─────────────────────────── 03 · IDENTIDADE ──────────────────────────────
  {
    id: 16,
    slug: "tipografia-com-opiniao",
    pillar: "identidade",
    archetype: "brutalist",
    theme: "dark",
    tag: "DISCIPLINA / IDENTIDADE & DESIGN",
    headline: "Tipografia com *opinião*.",
    subheadline: "Cor com função. Grid com consequência.",
    meta: { client: "Disciplina", discipline: "Identidade · Sistemas · Embalagem", year: "02" },
    caption: `Tipografia com opinião.

Uma fonte não é uma escolha de gosto. É uma declaração de posição. Serifada e cortante ou grotesca e brutal — tanto faz, desde que diga algo que a concorrência não diria.

Sistemas visuais que sobrevivem ao briefing seguinte começam aqui: tipografia com opinião, cor com função, grid com consequência.

→ Qual fonte a sua marca nunca usaria? Essa resposta diz muito.

${TAGS_BASE} #Tipografia #IdentidadeVisual #SistemaVisual #Brutalist`,
    imagePrompt:
      "Vintage letterpress studio with a cast-iron printing press, walls covered in bold typographic posters, moody tungsten light with deep shadows, shot on medium format film, Pentax 67 with 105mm f/2.4, monochrome with rich blacks, dust particles in light beams, --ar 4:5 --style raw --v 6",
    background: photo(6620963, "mono", "Antoni Shkraba / Pexels"),
  },
  {
    id: 17,
    slug: "cor-com-funcao",
    pillar: "identidade",
    archetype: "split",
    theme: "dark",
    tag: "IDENTIDADE / SISTEMA",
    headline: "Cor com função. Grid com *consequência*.",
    subheadline: "Cada decisão visual responde a uma pergunta feita antes.",
    meta: { client: "Método", discipline: "Sistema visual", year: "2025" },
    caption: `Cor com função. Grid com consequência.

Se o verde está ali porque "ficou bonito", ele sai na próxima reunião. Se está ali porque marca território em uma prateleira dominada por azul, ele fica por dez anos.

Sistema visual não é kit de peças. É um conjunto de decisões com motivo — que qualquer designer novo consegue continuar sem quebrar.

→ A sua identidade tem regras ou tem só exemplos?

${TAGS_BASE} #CorComFunção #Grid #SistemaVisual #CaseStudy`,
    imagePrompt:
      "Close-up of a hand applying thick black ink onto a vintage letterpress roller, macro detail of ink viscosity and metal texture, single hard side light, dark workshop background, shot on Canon R5 with 100mm macro f/4, tactile, cinematic, restrained palette with one acid-green ink can out of focus, --ar 4:5 --style raw --v 6",
    background: photo(6620997, "color", "Antoni Shkraba / Pexels"),
  },
  {
    id: 18,
    slug: "sobrevive-ao-briefing-seguinte",
    pillar: "identidade",
    archetype: "minimal",
    theme: "paper",
    tag: "IDENTIDADE / LONGEVIDADE",
    headline: "Sistemas visuais que sobrevivem ao *briefing seguinte*.",
    subheadline: "Identidade não é lançamento. É infraestrutura.",
    meta: { client: "Método", discipline: "Identidade", year: "2025" },
    caption: `Sistemas visuais que sobrevivem ao briefing seguinte.

Uma identidade bonita no dia do lançamento é fácil. Difícil é ela continuar coerente depois de 300 posts, 12 campanhas e 3 trocas de equipe.

Por isso projetamos infraestrutura, não peças: regras de composição, hierarquias tipográficas, lógica de cor e um grid que aguenta pressão.

→ Quantas versões do seu logo existem hoje no seu drive?

${TAGS_BASE} #Longevidade #SistemaVisual #Infraestrutura #MinimalPoster`,
    imagePrompt:
      "Craftsman holding a wooden typography block toward the camera in a printing workshop, shallow depth of field, soft window light, monochrome with warm paper tones, medium format film aesthetic, Mamiya RZ67, 110mm f/2.8, editorial documentary style, --ar 4:5 --style raw --v 6",
    background: photo(6621008, "mono", "Antoni Shkraba / Pexels"),
  },
  {
    id: 19,
    slug: "beleza-sem-argumento",
    pillar: "identidade",
    archetype: "kinetic",
    theme: "dark",
    tag: "IDENTIDADE / CRITÉRIO",
    headline: "Beleza sem argumento é *decoração*.",
    subheadline: "Cada decisão visual responde a uma pergunta estratégica.",
    meta: { client: "Método", discipline: "Design", year: "2025" },
    caption: `Beleza sem argumento é decoração.

E decoração é substituível. Basta uma nova tendência, um novo diretor, um novo template.

O que não se substitui é o argumento: a razão pela qual aquela cor, aquela fonte e aquele enquadramento existem — e por que nenhum outro serviria.

Design, aqui, é evidência de uma tese. Não enfeite.

→ Marque um designer que pensa antes de abrir o software.

${TAGS_BASE} #BelezaSemArgumento #DesignComArgumento #Critério #Motion`,
    imagePrompt:
      "Warped luminous grid dissolving into topographic contour lines, acid-green strokes on black with faint chromatic aberration, generative art, extreme precision, subtle depth, no text, --ar 4:5 --style raw --v 6",
    background: shader("grid", 77),
  },
  {
    id: 20,
    slug: "uma-pergunta",
    pillar: "identidade",
    archetype: "stat",
    theme: "dark",
    tag: "DADO / PROCESSO CRIATIVO",
    headline: "Uma pergunta antes de cada decisão *visual*.",
    subheadline: "Se não tem resposta, não entra no layout.",
    stat: { value: "1", label: "PERGUNTA ANTES DE CADA DECISÃO VISUAL" },
    meta: { client: "Método", discipline: "Processo", year: "2025" },
    caption: `Uma pergunta antes de cada decisão visual.

"Por que isso está aqui?"

Se a resposta for "porque ficou bonito", sai. Se for "porque a tese exige", fica. Simples de enunciar, difícil de sustentar sob prazo.

É esse filtro que separa um sistema visual de um Pinterest de referências.

→ Salve e aplique no próximo layout.

${TAGS_BASE} #UmaPergunta #ProcessoCriativo #Critério #BigStat`,
    imagePrompt:
      "Detailed view of a traditional cast-iron printing press in a dark studio, dramatic single-source light revealing gears and mechanisms, metallic texture, cinematic industrial mood, monochrome with deep contrast, Leica SL3 with 35mm APO f/2, --ar 4:5 --style raw --v 6",
    background: photo(6620985, "mono", "Antoni Shkraba / Pexels"),
  },
  {
    id: 21,
    slug: "anatomia-de-um-sistema",
    pillar: "identidade",
    archetype: "carousel",
    theme: "dark",
    tag: "IDENTIDADE / ANATOMIA",
    headline: "Anatomia de um *sistema visual*.",
    subheadline: "Quatro camadas. Nenhuma sobrevive sozinha.",
    slides: [
      {
        kicker: "IDENTIDADE & DESIGN",
        headline: "Anatomia de um *sistema visual*.",
        body: "Quatro camadas que fazem uma identidade sobreviver ao briefing seguinte.",
      },
      {
        kicker: "CAMADA 01 / TIPOGRAFIA",
        headline: "Tipografia com *opinião*.",
        body: "Um par de fontes em tensão: uma que fala alto e outra que organiza. Sem neutralidade.",
      },
      {
        kicker: "CAMADA 02 / COR",
        headline: "Cor com *função*.",
        body: "Uma cor de território, uma de estrutura, uma de silêncio. Cada uma com um trabalho.",
      },
      {
        kicker: "CAMADA 03 / GRID",
        headline: "Grid com *consequência*.",
        body: "Regras de composição que qualquer designer novo consegue continuar sem quebrar.",
      },
    ],
    meta: { client: "Método", discipline: "Identidade", year: "4 camadas" },
    caption: `Anatomia de um sistema visual.

Tipografia com opinião. Cor com função. Grid com consequência. E, por baixo de tudo, uma tese que explica por que cada camada existe.

Deslize para ver as quatro camadas — e o que acontece quando uma delas falta.

→ Salve para a próxima revisão de identidade.

${TAGS_BASE} #Anatomia #SistemaVisual #Tipografia #Cor #Grid #Carrossel`,
    imagePrompt:
      "Panoramic close-up of a hand operating a vintage printing press, ink rollers and metal type spread horizontally across a long frame, warm tungsten light with deep shadows, designed to be sliced into four vertical frames, medium format film grain, --ar 21:9 --style raw --v 6",
    background: photo(6620982, "mono", "Antoni Shkraba / Pexels"),
  },
  {
    id: 22,
    slug: "identidade-sistemas-embalagem",
    pillar: "identidade",
    archetype: "brutalist",
    theme: "dark",
    tag: "DISCIPLINA 02 / ESCOPO",
    headline: "Identidade · Sistemas · *Embalagem*",
    subheadline: "Do símbolo à prateleira, a mesma tese.",
    meta: { client: "Disciplina", discipline: "Identidade & Design", year: "02" },
    caption: `Identidade. Sistemas. Embalagem.

Três escalas do mesmo problema: como uma tese vira forma. No símbolo, no sistema que o sustenta e na embalagem que precisa vencer a prateleira em dois segundos.

Não fazemos "logo". Fazemos a decisão que o logo representa — e tudo o que ela exige depois.

→ Precisa que a prateleira trabalhe a seu favor? Fala com a gente.

${TAGS_BASE} #Identidade #Sistemas #Embalagem #Packaging #Brutalist`,
    imagePrompt:
      "Abstract vertical light curtains in deep green and black, soft luminous bands with subtle acid-green edges, like an aurora seen through frosted glass, minimal, ultra-smooth gradients, generative digital painting, --ar 4:5 --style raw --v 6",
    background: shader("aurora", 85),
  },

  // ──────────────────────────── 04 · CAMPANHA ───────────────────────────────
  {
    id: 23,
    slug: "cabe-em-uma-frase",
    pillar: "campanha",
    archetype: "brutalist",
    theme: "dark",
    tag: "DISCIPLINA / CAMPANHA & FILME",
    headline: "Uma ideia que cabe em uma frase e aguenta *60 segundos*.",
    subheadline: "Escrevemos, dirigimos e entregamos com a mesma equipe.",
    meta: { client: "Disciplina", discipline: "Criação · Direção · Produção", year: "03" },
    caption: `Uma ideia que cabe em uma frase e aguenta um filme de 60 segundos.

Esse é o teste. Se a ideia precisa de um parágrafo para ser explicada, não é uma ideia — é um plano. Se cabe em uma frase mas não aguenta 60 segundos, é um slogan.

Campanha & Filme na Desco: escrevemos, dirigimos e entregamos com a mesma equipe. Do primeiro rascunho ao monitoramento de resultado.

→ Qual campanha você resume em uma frase até hoje?

${TAGS_BASE} #Campanha #Filme #UmaFrase #60Segundos #Brutalist`,
    imagePrompt:
      "Football stadium crowd engulfed in colored smoke, arms raised, shot from within the stands with a 24mm lens, high-contrast duotone in black and acid green (#d4ff00), heavy grain, motion blur on flags, raw documentary energy, --ar 4:5 --style raw --v 6",
    background: photo(12153239, "duotone", "Beyza Kaplan / Pexels"),
  },
  {
    id: 24,
    slug: "mesma-equipe",
    pillar: "campanha",
    archetype: "split",
    theme: "dark",
    tag: "CAMPANHA / PROCESSO",
    headline: "Escrevemos, dirigimos, entregamos. *Mesma equipe*.",
    subheadline: "Do primeiro rascunho ao monitoramento de resultados.",
    meta: { client: "Método", discipline: "Criação · Direção · Produção", year: "2025" },
    caption: `Escrevemos, dirigimos, entregamos. Mesma equipe.

Cada vez que uma ideia muda de mão, ela perde um pedaço. Do redator para o diretor, do diretor para a produtora, da produtora para a edição — no fim, ninguém reconhece a frase que começou tudo.

Por isso a Desco mantém a mesma equipe do rascunho ao relatório. Menos ruído, mais consequência.

→ Quer ver um filme que chegou inteiro na tela? Link na bio.

${TAGS_BASE} #MesmaEquipe #Direção #Produção #CaseStudy`,
    imagePrompt:
      "Football supporters with flags and painted faces cheering in a packed stand, shot with a 35mm f/1.4 at dusk, mixed stadium floodlights, cinematic desaturated grade with deep blacks and one warm accent, documentary sports photography, --ar 4:5 --style raw --v 6",
    background: photo(10183957, "color", "El gringo photo / Pexels"),
  },
  {
    id: 25,
    slug: "sessenta-segundos",
    pillar: "campanha",
    archetype: "stat",
    theme: "dark",
    tag: "DADO / FORMATO",
    headline: "Uma frase. Sessenta *segundos*.",
    subheadline: "Se a ideia não aguenta o filme, não aguenta a campanha.",
    stat: { value: "60", label: "SEGUNDOS. UMA FRASE. UMA IDEIA." },
    meta: { client: "Método", discipline: "Filme", year: "2025" },
    caption: `Sessenta segundos.

É o tempo que uma ideia tem para provar que é uma ideia. Se ela precisa de legenda, contexto ou "veja também", já perdeu.

O filme é o teste de estresse da estratégia. Se a tese aguenta um minuto de tela, aguenta um ano de campanha.

→ Qual filme de 60 segundos você nunca esqueceu?

${TAGS_BASE} #60Segundos #Filme #TesteDeEstresse #BigStat`,
    imagePrompt:
      "Dark gradient mesh with a single large soft sphere of acid-green light emerging from black, like a stage spotlight seen through fog, minimal, cinematic, volumetric, ultra-smooth, --ar 4:5 --style raw --v 6",
    background: shader("mesh", 96),
  },
  {
    id: 26,
    slug: "criacao-direcao-producao",
    pillar: "campanha",
    archetype: "kinetic",
    theme: "dark",
    tag: "DISCIPLINA 03 / ESCOPO",
    headline: "Criação · Direção · *Produção*",
    subheadline: "Com apresentadores renomados ou com quem faz a marca acontecer todo dia.",
    meta: { client: "Disciplina", discipline: "Campanha & Filme", year: "03" },
    caption: `Criação. Direção. Produção.

Já filmamos com Eliana e Tirullipa em horário nobre do SBT. Já filmamos com a família real de uma marca de feijão, sem figurantes. Já filmamos com quem faz uma faculdade acontecer em sala, no laboratório e na rua.

O critério nunca foi o cachê. Foi a tese.

→ Assista aos filmes no link da bio.

${TAGS_BASE} #Criação #Direção #Produção #Filme #Motion`,
    imagePrompt:
      "Roaring football crowd at night under floodlights, thousands of raised phones and scarves, extreme depth, monochrome with crushed blacks and blooming highlights, shot on Sony A1 with 70-200mm f/2.8 at 1/60s, motion energy, --ar 4:5 --style raw --v 6",
    background: photo(33428834, "mono", "hayati ilker ergün / Pexels"),
  },
  {
    id: 27,
    slug: "humor-abre-a-porta",
    pillar: "campanha",
    archetype: "minimal",
    theme: "dark",
    tag: "CAMPANHA / MECÂNICA",
    headline: "O humor abre a porta. A tecnologia fecha o *argumento*.",
    subheadline: "Nova embalagem, mesma tecnologia exclusiva.",
    meta: { client: "Tintas Maestria", discipline: "Lançamento", year: "2024" },
    caption: `O humor abre a porta. A tecnologia fecha o argumento.

Foi assim no lançamento da nova embalagem Multiway, da Tintas Maestria: rimos primeiro, explicamos depois. Porque ninguém para o scroll para ouvir sobre tecnologia de tinta — mas todo mundo para para rir.

O humor é a entrada. A prova é o que faz ficar.

→ Veja o filme completo no link da bio.

${TAGS_BASE} #Humor #Argumento #TintasMaestria #Multiway #MinimalPoster`,
    imagePrompt:
      "Portrait of a woman emerging from total darkness, only a thin sliver of hard light across the eyes, black background, mysterious, high-fashion editorial, shot on Phase One with 80mm f/2.8, cinematic desaturated tones, --ar 4:5 --style raw --v 6",
    background: photo(15011445, "color", "Yağmur Özdoğan / Pexels"),
  },
  {
    id: 28,
    slug: "gramado-a-arquibancada",
    pillar: "campanha",
    archetype: "carousel",
    theme: "dark",
    tag: "CAMPANHA / ANATOMIA",
    headline: "Do gramado à *arquibancada*.",
    subheadline: "Anatomia de uma campanha que funciona no telão e no story.",
    slides: [
      {
        kicker: "CAMPANHA & FILME",
        headline: "Do gramado à *arquibancada*.",
        body: "Como uma ideia sobrevive do telão do estádio ao story de 15 segundos. Deslize.",
      },
      {
        kicker: "01 / A FRASE",
        headline: "Uma frase que funciona como *carimbo*.",
        body: "Repetível, teimosa, impossível de confundir. Se precisa de explicação, ainda não está pronta.",
      },
      {
        kicker: "02 / O FILME",
        headline: "Sessenta segundos que provam a *tese*.",
        body: "Escrevemos, dirigimos e entregamos com a mesma equipe. Sem perder pedaço no caminho.",
      },
      {
        kicker: "03 / O SISTEMA",
        headline: "Cores marcantes, tipografia de *impacto*.",
        body: "Uma linguagem que funciona igual no telão do estádio e no story de 15 segundos.",
      },
      {
        kicker: "04 / O RESULTADO",
        headline: "Uma campanha construída para ser *respondida*.",
        body: "Cada peça abre uma conversa. Monitoramos cada resposta até o fim.",
      },
    ],
    meta: { client: "Método", discipline: "Campanha", year: "4 etapas" },
    caption: `Do gramado à arquibancada.

Uma campanha que funciona no telão do estádio precisa funcionar também no story de 15 segundos. Mesma frase, mesma tese, escalas diferentes.

01 — A frase.
02 — O filme.
03 — O sistema.
04 — O resultado.

Deslize para ver a anatomia completa.

→ Salve para o próximo planejamento de campanha.

${TAGS_BASE} #DoGramadoÀArquibancada #Campanha #Anatomia #Carrossel`,
    imagePrompt:
      "Ultra-wide panoramic view from the top of a football stadium stands looking down at the illuminated pitch, spectators in silhouette, long horizontal composition to be sliced into five vertical frames, cold floodlight tones against black, cinematic, --ar 21:9 --style raw --v 6",
    background: photo(3131407, "mono", "Furknsaglam / Pexels"),
  },
  {
    id: 29,
    slug: "sem-banco-de-imagem",
    pillar: "campanha",
    archetype: "brutalist",
    theme: "dark",
    tag: "CAMPANHA / FIB — QUEM FAZ, FAZ FIB",
    headline: "Sem banco de *imagem*.",
    subheadline:
      "Quem aparece na campanha é quem faz a FIB acontecer — em sala, no laboratório e na rua.",
    meta: { client: "FIB", discipline: "Vestibular 2026", year: "2025" },
    caption: `Sem banco de imagem.

Para a campanha do Vestibular 2026 da FIB, uma regra inegociável: quem aparece é quem faz a instituição acontecer todos os dias. Alunos, professores, técnicos. Em sala, no laboratório, na rua.

O conceito, o KV e a tag que guiou tudo: Quem Faz, Faz FIB.

Não foi só uma campanha de vestibular. Foi um projeto completo de construção de marca.

→ Veja o filme no link da bio.

${TAGS_BASE} #FIB #QuemFazFazFIB #SemBancoDeImagem #Vestibular2026 #Brutalist`,
    imagePrompt:
      "Empty rural road with a painted crosswalk curving into the horizon at sunrise, low warm light raking across asphalt texture, mist in the fields, shot on Fujifilm GFX 100 II with 45mm f/8, documentary landscape, muted palette with one warm highlight, --ar 4:5 --style raw --v 6",
    background: photo(16962782, "color", "虎 曼 / Pexels"),
  },

  // ──────────────────────────── 05 · CONTEÚDO ───────────────────────────────
  {
    id: 30,
    slug: "personagens-nao-postagens",
    pillar: "conteudo",
    archetype: "kinetic",
    theme: "dark",
    tag: "DISCIPLINA / TOM DE VOZ & CONTEÚDO",
    headline: "Personagens, não *postagens*.",
    subheadline: "Vozes que respondem, provocam e continuam existindo depois que o calendário acaba.",
    meta: { client: "Disciplina", discipline: "Tom de voz · Editorial · Comunidade", year: "04" },
    caption: `Personagens, não postagens.

Calendário de conteúdo é o jeito mais eficiente de produzir coisas que ninguém lê. Personagem é diferente: tem opinião, responde, provoca — e continua existindo quando o mês acaba.

Tom de Voz & Conteúdo Contínuo na Desco: construímos a voz antes de construir a grade.

→ A sua marca tem uma voz ou tem uma agenda?

${TAGS_BASE} #TomDeVoz #Personagem #ConteúdoContínuo #Motion`,
    imagePrompt:
      "Vertical bands of luminous green and black light slowly flowing like silk in wind, abstract aurora, deep contrast, minimal, ultra-smooth gradients, no stars, generative art, --ar 4:5 --style raw --v 6",
    background: shader("aurora", 103),
  },
  {
    id: 31,
    slug: "vozes-que-respondem",
    pillar: "conteudo",
    archetype: "split",
    theme: "dark",
    tag: "CONTEÚDO / COMUNIDADE",
    headline: "Vozes que respondem, provocam e *continuam existindo*.",
    subheadline: "Estratégia de redes sociais com interação direta com o público.",
    meta: { client: "Método", discipline: "Comunidade", year: "2025" },
    caption: `Vozes que respondem, provocam e continuam existindo.

Estratégia de rede social não é grade de posts. É a decisão de quem fala, como fala e o que nunca diria. Depois disso, é interação direta: comentário por comentário, sem resposta padrão.

O feed é o palco. A voz é o personagem. A comunidade é o resultado.

→ Responda: qual marca você já respondeu no feed e ela respondeu de volta?

${TAGS_BASE} #Comunidade #InteraçãoDireta #TomDeVoz #CaseStudy`,
    imagePrompt:
      "Artistic portrait of a woman in a dark room leaning against a wall, only partially lit by a sliver of window light, deep shadows, cinematic mood, shot on Leica Q3 28mm f/1.7, film grain, desaturated palette with one warm tone, --ar 4:5 --style raw --v 6",
    background: photo(5014213, "color", "Sinitta Leunen / Pexels"),
  },
  {
    id: 32,
    slug: "o-rei-responde",
    pillar: "conteudo",
    archetype: "stat",
    theme: "dark",
    tag: "DADO / AÇAÍ DA BARRA",
    headline: "Uma campanha construída para ser *respondida*.",
    subheadline: "Cada filme abre uma conversa — e o Rei responde.",
    stat: { value: "24/7", label: "O PERSONAGEM RESPONDE. COMENTÁRIO POR COMENTÁRIO." },
    meta: { client: "Açaí da Barra", discipline: "Tom de voz", year: "2024" },
    caption: `24 horas por dia, o Rei responde.

Para o Açaí da Barra, construímos um personagem, não um mascote: o Rei do Deboche. Uma franquia com licença para rir de si mesma — e que responde comentário por comentário, com Tirullipa no comando.

Cada filme abre uma conversa. A campanha foi construída para ser respondida.

→ Já foi respondido pelo Rei? Conta aqui.

${TAGS_BASE} #AçaíDaBarra #ReiDoDeboche #Personagem #BigStat`,
    imagePrompt:
      "Side profile of a bearded man laughing in a studio, hard rim light, high-contrast duotone in black and acid green (#d4ff00), halftone poster texture, punk zine aesthetic, shot on 85mm f/2, --ar 4:5 --style raw --v 6",
    background: photo(10340632, "duotone", "cottonbro studio / Pexels"),
  },
  {
    id: 33,
    slug: "tom-editorial-comunidade",
    pillar: "conteudo",
    archetype: "brutalist",
    theme: "dark",
    tag: "DISCIPLINA 04 / ESCOPO",
    headline: "Tom de voz · Editorial · *Comunidade*",
    subheadline: "Nosso repositório aberto de pensamento: notas, métodos e o que aprendemos errando em público.",
    meta: { client: "Disciplina", discipline: "Conteúdo contínuo", year: "04" },
    caption: `Tom de voz. Editorial. Comunidade.

Três camadas da mesma disciplina. A voz define quem fala. O editorial define sobre o quê. A comunidade é o que acontece quando as duas primeiras são honestas.

Também vale para nós: mantemos um repositório aberto de pensamento — notas, métodos e o que aprendemos errando em público.

→ Quer receber as notas? Link na bio.

${TAGS_BASE} #TomDeVoz #Editorial #Comunidade #Brutalist`,
    imagePrompt:
      "Striking black and white portrait, intense expression, hard light from above casting deep eye-socket shadows, skin texture in sharp detail, pure black background, shot on Hasselblad with 100mm f/2.2, Platon-inspired editorial style, --ar 4:5 --style raw --v 6",
    background: photo(29793410, "mono", "Ander Masó / Pexels"),
  },
  {
    id: 34,
    slug: "depois-do-calendario",
    pillar: "conteudo",
    archetype: "minimal",
    theme: "paper",
    tag: "CONTEÚDO / LONGEVIDADE",
    headline: "Depois que o *calendário* acaba.",
    subheadline: "É aí que se descobre se existia uma voz ou só uma agenda.",
    meta: { client: "Método", discipline: "Conteúdo", year: "2025" },
    caption: `Depois que o calendário acaba.

Todo mês tem 30 posts programados. E no dia 31, o que sobra? Se a resposta for "nada", a marca não tinha uma voz. Tinha uma agenda.

Personagens continuam existindo depois do cronograma. Respondem, aparecem, discordam. Isso não se programa — se constrói.

→ O que a sua marca diria se não tivesse nada agendado para hoje?

${TAGS_BASE} #DepoisDoCalendário #Voz #Longevidade #MinimalPoster`,
    imagePrompt:
      "Family dinner outdoors at dusk, candles on a long wooden table, food and drinks shared, warm intimate light against a dark garden, documentary style, shot on 35mm f/1.4, natural gestures, muted warm palette, --ar 4:5 --style raw --v 6",
    background: photo(8841607, "mono", "Julia M Cameron / Pexels"),
  },
  {
    id: 35,
    slug: "voz-que-sobrevive-ao-feed",
    pillar: "conteudo",
    archetype: "carousel",
    theme: "dark",
    tag: "CONTEÚDO / MÉTODO",
    headline: "Como construir uma voz que *sobrevive* ao feed.",
    subheadline: "Cinco decisões antes do primeiro post.",
    slides: [
      {
        kicker: "TOM DE VOZ & CONTEÚDO",
        headline: "Como construir uma voz que *sobrevive* ao feed.",
        body: "Cinco decisões antes do primeiro post. Deslize.",
      },
      {
        kicker: "01 / QUEM FALA",
        headline: "Um personagem, não um *departamento*.",
        body: "Nome, temperamento, manias. Se qualquer pessoa da empresa pode ter escrito, ninguém escreveu.",
      },
      {
        kicker: "02 / O QUE NUNCA DIRIA",
        headline: "O silêncio também é *voz*.",
        body: "Lista do que a marca não comenta, não usa e não responde. Mais útil que o manual de tom.",
      },
      {
        kicker: "03 / COMO RESPONDE",
        headline: "Comentário por *comentário*.",
        body: "Sem resposta padrão. O feed é o palco, mas a conversa acontece embaixo dele.",
      },
      {
        kicker: "04 / QUANDO ERRA",
        headline: "Errar em *público*.",
        body: "Personagem que nunca erra não é personagem. É release. Aprendemos isso errando também.",
      },
    ],
    meta: { client: "Método", discipline: "Conteúdo", year: "5 decisões" },
    caption: `Como construir uma voz que sobrevive ao feed.

Cinco decisões que precisam acontecer antes do primeiro post — e que quase sempre são puladas.

01 — Quem fala.
02 — O que nunca diria.
03 — Como responde.
04 — Quando erra.
05 — O que sobra quando o calendário acaba.

Deslize para ler cada uma.

→ Salve e compartilhe com quem cuida das redes da sua marca.

${TAGS_BASE} #Voz #TomDeVoz #Método #Carrossel`,
    imagePrompt:
      "Seamless horizontal gradient mesh, dark charcoal and moss green orbs drifting across a long black strip with acid-green highlights, designed to be sliced into five vertical frames, ultra-smooth, generative, --ar 21:9 --style raw --v 6",
    background: shader("mesh", 117),
  },
  {
    id: 36,
    slug: "construida-para-ser-respondida",
    pillar: "conteudo",
    archetype: "split",
    theme: "dark",
    tag: "CONTEÚDO / CAMPANHA CONVERSACIONAL",
    headline: "Uma campanha construída para ser *respondida*.",
    subheadline: "Cada filme abre uma conversa.",
    meta: { client: "Açaí da Barra", discipline: "Campanha + Comunidade", year: "2024" },
    caption: `Uma campanha construída para ser respondida.

A maioria das campanhas termina quando o filme acaba. A do Rei do Deboche começa ali: cada filme abre uma pergunta, e o personagem responde quem responde.

O resultado não é alcance. É conversa. E conversa é o que faz uma franquia de açaí virar personagem cultural do verão.

→ Veja os filmes no link da bio.

${TAGS_BASE} #AçaíDaBarra #CampanhaConversacional #Personagem #CaseStudy`,
    imagePrompt:
      "Moody studio portrait of a young man, face half illuminated by a warm beam of light, deep black surroundings, expressive gaze, shot on Canon R5 with 85mm f/1.2, cinematic grade with teal shadows and warm highlights, --ar 4:5 --style raw --v 6",
    background: photo(18018264, "color", "Caner Kökçü / Pexels"),
  },

  // ───────────────────────────── 06 · CASOS ─────────────────────────────────
  {
    id: 37,
    slug: "maestria-spfc",
    pillar: "casos",
    archetype: "split",
    theme: "dark",
    tag: "CASO / TINTAS MAESTRIA × SÃO PAULO F.C.",
    headline: "A mesma tinta do *MorumBIS*.",
    subheadline:
      "A que pinta o gramado, as cadeiras e os corredores é a que vai para a parede da sua casa.",
    meta: { client: "Tintas Maestria", discipline: "Licenciamento / Lançamento", year: "2024" },
    caption: `A mesma tinta do MorumBIS.

A tinta que pinta o gramado, as cadeiras e os corredores do estádio é a mesma que vai para a parede da sua casa. Esse foi o argumento da parceria Tintas Maestria × São Paulo Futebol Clube — e ele não precisou de exagero.

Licenciamento, campanha de lançamento e ativação na Confut Sudamericana 2024. Cores marcantes, tipografia de impacto e uma linguagem que funciona igual no telão e no story.

→ Veja o case completo no link da bio.

${TAGS_BASE} #TintasMaestria #SãoPauloFC #MorumBIS #Licenciamento #Case`,
    imagePrompt:
      "Man painting a wall with a roller, bold flat color emerging on raw plaster, low-key lighting with a single window source, dust in the air, documentary style, shot on 35mm f/2, muted palette with one saturated accent, --ar 4:5 --style raw --v 6",
    background: photo(7218579, "color", "Blue Bird / Pexels"),
  },
  {
    id: 38,
    slug: "noroeste-paixao",
    pillar: "casos",
    archetype: "brutalist",
    theme: "dark",
    tag: "CASO / E.C. NOROESTE — PAIXÃO PELO QUE SOMOS",
    headline: "Um clube de 1910 não precisa ser lembrado. Precisa ser *sentido*.",
    subheadline: "Trocamos a nostalgia por um manifesto de pertencimento escrito no presente.",
    meta: { client: "E.C. Noroeste", discipline: "Identidade de torcida / Institucional", year: "2024" },
    caption: `Um clube de 1910 não precisa ser lembrado. Precisa ser sentido.

Para o E.C. Noroeste, trocamos a nostalgia por um manifesto de pertencimento escrito no presente do indicativo. "Paixão pelo que somos" não é sobre o passado — é sobre quem está na arquibancada hoje.

Mais do que comunicação: uma imersão na paixão de ser Norusca, traduzida em marca, campanha e conteúdo.

→ Assista ao filme no link da bio.

${TAGS_BASE} #ECNoroeste #Norusca #PaixãoPeloQueSomos #IdentidadeDeTorcida #Case`,
    imagePrompt:
      "Football stadium at sunset with a packed crowd in silhouette against mountains, high-contrast duotone in black and acid green (#d4ff00), grainy documentary texture, wide 24mm lens from the upper stands, epic scale, --ar 4:5 --style raw --v 6",
    background: photo(36227922, "duotone", "Hüseyin KARACA / Pexels"),
  },
  {
    id: 39,
    slug: "picinin-meio-seculo",
    pillar: "casos",
    archetype: "carousel",
    theme: "dark",
    tag: "CASO / PICININ — MEIO SÉCULO EM FAMÍLIA",
    headline: "Cinquenta anos cabem em uma *mesa*.",
    subheadline: "Documentamos a família real, sem figurantes.",
    slides: [
      {
        kicker: "CASO / PICININ ALIMENTOS",
        headline: "Cinquenta anos cabem em uma *mesa*.",
        body: "Campanha comemorativa dos 50 anos da Picinin. Deslize para ver como uma palavra virou plataforma.",
      },
      {
        kicker: "01 / A TESE",
        headline: "Meio século cabe em uma palavra: *família*.",
        body: "Para a Picinin, cinquenta anos não são um marco corporativo. São gerações à mesa.",
      },
      {
        kicker: "02 / A DECISÃO",
        headline: "Família real. *Sem figurantes*.",
        body: "Documentamos as famílias de verdade e deixamos que a comida fizesse o discurso.",
      },
      {
        kicker: "03 / O SISTEMA",
        headline: "Uma frase que funciona como *carimbo*.",
        body: "Meio Século em Família: repetível, teimosa, impossível de confundir. TV, redes, PDV e endomarketing.",
      },
    ],
    meta: { client: "Picinin Alimentos", discipline: "Campanha comemorativa 50 anos", year: "2023" },
    caption: `Cinquenta anos cabem em uma mesa.

O que são 50 anos? Para a Picinin Alimentos, meio século de existência cabe em uma palavra: família.

Documentamos a família real, sem figurantes, e deixamos que a comida fizesse o discurso. Cada filme acompanha uma família diferente — nenhuma igual à outra, e é exatamente isso que as une à marca.

Deslize para ver a tese, a decisão e o sistema.

→ Veja os filmes no link da bio.

${TAGS_BASE} #Picinin #MeioSéculoEmFamília #50Anos #Case #Carrossel`,
    imagePrompt:
      "Panoramic overhead view of a long family dinner table, hands passing dishes, rice and beans, warm tungsten light with deep shadows, documentary food photography, designed to be sliced into four vertical frames, shot on 35mm f/2.8, --ar 21:9 --style raw --v 6",
    background: photo(20488692, "color", "Gül Işık / Pexels"),
  },
  {
    id: 40,
    slug: "picinin-cinquenta",
    pillar: "casos",
    archetype: "stat",
    theme: "dark",
    tag: "DADO / PICININ ALIMENTOS",
    headline: "Meio século cabe em uma palavra: *família*.",
    subheadline: "O produto no centro da mesa. A mesa no centro da casa.",
    stat: { value: "50", label: "ANOS EM UMA MESA. UMA PALAVRA." },
    meta: { client: "Picinin Alimentos", discipline: "Plataforma de marca", year: "2023" },
    caption: `50 anos. Uma mesa. Uma palavra.

O produto no centro da mesa e a mesa no centro da casa. Fotografia e filme com a mesma luz e o mesmo apetite. Uma frase que funciona como carimbo: Meio Século em Família.

Foi a plataforma que sustentou a virada dos 50 anos da Picinin — da TV ao ponto de venda, do especial no G1 ao endomarketing.

→ Case completo no link da bio.

${TAGS_BASE} #Picinin #50Anos #Família #PlataformaDeMarca #BigStat`,
    imagePrompt:
      "Overhead view of a traditional feast on a dark wooden table, many dishes arranged in an organic grid, moody directional light, rich textures, monochrome with deep contrast, shot on 50mm f/4 from above, --ar 4:5 --style raw --v 6",
    background: photo(38855295, "mono", "Aabouden Yassir / Pexels"),
  },
  {
    id: 41,
    slug: "coala-assinatura",
    pillar: "casos",
    archetype: "minimal",
    theme: "dark",
    tag: "CASO / COALA ESSÊNCIAS — ORIGINAL COMO VOCÊ",
    headline: "Cada frasco é uma *assinatura*, não uma imitação.",
    subheadline: "Perfumaria fala de desejo com clichês. Falamos de identidade com fatos.",
    meta: { client: "Coala Essências", discipline: "Posicionamento / Plataforma", year: "2024" },
    caption: `Cada frasco é uma assinatura, não uma imitação.

Perfumaria fala de desejo com clichês. Para a Coala Essências, falamos de identidade com fatos. "Original como você" — uma tagline que aproxima quem usa os produtos há mais de 30 anos, em um momento em que a marca lança novas linhas e entra em mercados diferentes.

Com Eliana como garota-propaganda, em VT usado nos merchans nacionais do SBT.

→ Case completo no link da bio.

${TAGS_BASE} #CoalaEssências #OriginalComoVocê #Perfumaria #Posicionamento #Case`,
    imagePrompt:
      "Luxurious black perfume bottle on a glossy black surface with a precise reflection, single soft top light, ultra-minimal still life, deep blacks, product photography on Phase One with 120mm macro f/8, one thin acid-green light edge, --ar 4:5 --style raw --v 6",
    background: photo(11216321, "color", "Keifer Costa / Pexels"),
  },
  {
    id: 42,
    slug: "rei-do-deboche",
    pillar: "casos",
    archetype: "kinetic",
    theme: "dark",
    tag: "CASO / AÇAÍ DA BARRA — O REI DO DEBOCHE",
    headline: "O Rei do *Deboche*.",
    subheadline: "A lenda que aparece todo verão e faz até quem não gosta de açaí, gostar.",
    meta: { client: "Açaí da Barra", discipline: "Tom de voz / Campanha", year: "2024" },
    caption: `O Rei do Deboche.

Uma franquia de açaí com licença para rir de si mesma. Construímos um personagem, não um mascote — com Tirullipa no comando — e ele responde comentário por comentário.

A lenda que aparece todo verão e faz até quem não gosta de açaí, gostar. Uma campanha construída para ser respondida.

→ Veja os filmes no link da bio.

${TAGS_BASE} #AçaíDaBarra #ReiDoDeboche #Tirullipa #Personagem #Case`,
    imagePrompt:
      "Glossy black liquid folding with electric acid-green (#d4ff00) veins, playful energetic fluid simulation, macro 3D render with caustics, dark studio, punchy contrast, --ar 4:5 --style raw --v 6",
    background: shader("liquid", 129),
  },
  {
    id: 43,
    slug: "multiway",
    pillar: "casos",
    archetype: "split",
    theme: "dark",
    tag: "CASO / TINTAS MAESTRIA — MULTIWAY",
    headline: "Multiway só a *Maestria* tem.",
    subheadline: "Humor como ferramenta de lançamento: nova embalagem, mesma tecnologia exclusiva.",
    meta: { client: "Tintas Maestria", discipline: "Branding / Campanha de produto", year: "2024" },
    caption: `Multiway só a Maestria tem.

A nova embalagem no centro da cena. O humor abre a porta; a tecnologia fecha o argumento. Dois filmes, um lançamento e uma frase que só um concorrente poderia usar — se tivesse a tecnologia.

Branding e campanha de produto para a Tintas Maestria.

→ Assista aos dois filmes no link da bio.

${TAGS_BASE} #TintasMaestria #Multiway #Lançamento #Case`,
    imagePrompt:
      "Paint roller resting on a wooden stepladder against a half-painted wall, bold saturated color meeting raw plaster in a sharp diagonal, soft daylight, minimal composition, shot on 50mm f/4, --ar 4:5 --style raw --v 6",
    background: photo(5799046, "color", "Ivan S / Pexels"),
  },
  {
    id: 44,
    slug: "loteamento-horizonte",
    pillar: "casos",
    archetype: "brutalist",
    theme: "dark",
    tag: "CASO / IMOBILIÁRIO — PRÉ-LANÇAMENTO DIGITAL",
    headline: "Tiramos o render brilhante da frente.",
    subheadline: "E colocamos o terreno, a rua e o *horizonte*.",
    meta: { client: "Loteamento", discipline: "Digital · Pré-lançamento", year: "2024" },
    caption: `Tiramos o render brilhante da frente.

Loteamento é promessa de futuro vendida no presente. O mercado inteiro vende com o mesmo render 3D, a mesma família sorridente e o mesmo pôr do sol.

Fizemos o contrário: mostramos o terreno, a rua e o horizonte. O que existe. E deixamos o futuro para quem compra.

Pré-lançamento digital para o setor imobiliário.

→ Veja o case no link da bio.

${TAGS_BASE} #Imobiliário #PréLançamento #SemRender #Horizonte #Case`,
    imagePrompt:
      "Empty country road stretching to the horizon under a vivid dusk sky, minimal composition with the road as a single vertical line, warm sun glow at the vanishing point, shot on Fujifilm GFX with 63mm f/8, documentary landscape, --ar 4:5 --style raw --v 6",
    background: photo(9067042, "color", "Elena Yunina / Pexels"),
  },

  // ─────────────────────────── 07 · INTERIOR ────────────────────────────────
  {
    id: 45,
    slug: "bauru-por-escolha",
    pillar: "interior",
    archetype: "brutalist",
    theme: "dark",
    tag: "CULTURA / BAURU POR ESCOLHA",
    headline: "Operamos de Bauru por *escolha*.",
    subheadline: "Não por falta de opção.",
    meta: { client: "Desco", discipline: "Cultura", year: "Est. 2015" },
    caption: `Operamos de Bauru por escolha.

Jardim Europa, Av. Getúlio Vargas, 22-25. Interior de São Paulo. Dez anos aqui — não por falta de opção, mas porque a distância dos centros é o que nos permite ver o óbvio antes dele virar tendência.

Marcas de tintas, alimentos, energia, futebol, educação e imobiliário já entenderam isso.

→ Passa aqui. Sem formulário.

${TAGS_BASE} #BauruPorEscolha #InteriorDeSP #JardimEuropa #Brutalist`,
    imagePrompt:
      "Empty asphalt road cutting through green fields at dusk, low horizon, dramatic sky turned monochrome with deep blacks, lonely and precise, shot on Hasselblad with 38mm f/8, fine art landscape, --ar 4:5 --style raw --v 6",
    background: photo(10610187, "mono", "alleksana / Pexels"),
  },
  {
    id: 46,
    slug: "coordenadas",
    pillar: "interior",
    archetype: "stat",
    theme: "dark",
    tag: "DADO / COORDENADAS",
    headline: "Interior de São Paulo. *Brasil*.",
    subheadline: "Jardim Europa · Bauru/SP.",
    stat: { value: "22°19'S", label: "49°04'W — BAURU/SP — EST. 2015" },
    meta: { client: "Desco", discipline: "Localização", year: "2015—" },
    caption: `22°19'S, 49°04'W.

Coordenadas de onde a Desco pensa marca há dez anos. Interior de São Paulo, Brasil. A 330 km do eixo que acha que pensamento acontece só lá.

Interior não é periferia. É ponto de vista.

→ Marque quem também constrói fora do eixo.

${TAGS_BASE} #Coordenadas #Bauru #ForaDoEixo #BigStat`,
    imagePrompt:
      "Abstract aurora of slow vertical light bands in deep green and black, subtle acid-green highlights along the edges, like a satellite view of night terrain, minimal, generative, ultra-smooth, --ar 4:5 --style raw --v 6",
    background: shader("aurora", 146),
  },
  {
    id: 47,
    slug: "descocreators",
    pillar: "interior",
    archetype: "split",
    theme: "dark",
    tag: "DESCOCREATORS / CURADORIA · ATIVAÇÃO",
    headline: "Entrada por curadoria, não por número de *seguidores*.",
    subheadline: "Rede própria de criadores do interior paulista.",
    meta: { client: "DescoCreators", discipline: "Curadoria · Ativação", year: "2025" },
    caption: `Entrada por curadoria, não por número de seguidores.

DescoCreators é a nossa rede própria de criadores do interior paulista. Não é uma lista de influenciadores — é um banco de talentos permanente, com entrada por curadoria e briefing real antes de qualquer entrevista.

Porque a voz certa para a marca raramente é a maior.

→ Cria conteúdo no interior? Escreve para a gente.

${TAGS_BASE} #DescoCreators #Curadoria #CriadoresDoInterior #CaseStudy`,
    imagePrompt:
      "Long straight road disappearing into a glowing sunset horizon, dramatic clouds, cinematic wide shot on 24mm f/8, warm-to-cool gradient sky, documentary road trip aesthetic, --ar 4:5 --style raw --v 6",
    background: photo(19923060, "color", "Matheus Bertelli / Pexels"),
  },
  {
    id: 48,
    slug: "ver-o-obvio",
    pillar: "interior",
    archetype: "minimal",
    theme: "paper",
    tag: "CULTURA / DISTÂNCIA COMO MÉTODO",
    headline: "Ver o óbvio antes dele virar *tendência*.",
    subheadline: "A distância dos centros é o que nos permite isso.",
    meta: { client: "Desco", discipline: "Cultura", year: "2025" },
    caption: `Ver o óbvio antes dele virar tendência.

Tendência é o óbvio depois que todo mundo percebeu. Estar longe do barulho dos centros dá uma vantagem simples: a gente vê a coisa antes de ela ganhar nome, hashtag e palestra.

A distância não é limitação. É método.

→ Qual "tendência" você já sabia antes de virar tendência?

${TAGS_BASE} #VerOÓbvio #Tendência #DistânciaComoMétodo #MinimalPoster`,
    imagePrompt:
      "Rural road under a vast sunset sky, extreme minimalism, road as a thin line at the bottom third, monochrome with soft paper-like tonal range, fine art landscape, shot on large format 4x5 film, --ar 4:5 --style raw --v 6",
    background: photo(12987110, "mono", "Dương Nhân / Pexels"),
  },
  {
    id: 49,
    slug: "quatro-provas",
    pillar: "interior",
    archetype: "carousel",
    theme: "dark",
    tag: "CULTURA / QUATRO PROVAS",
    headline: "Interior não é periferia: *quatro provas*.",
    subheadline: "Deslize.",
    slides: [
      {
        kicker: "INTERIOR & CULTURA DESCO",
        headline: "Interior não é periferia: *quatro provas*.",
        body: "Dez anos de operação a partir de Bauru. Deslize para ver as evidências.",
      },
      {
        kicker: "PROVA 01",
        headline: "Setores *diferentes*, o mesmo critério.",
        body: "Tintas, alimentos, energia, futebol, educação e imobiliário. Coragem para parecer com o que são.",
      },
      {
        kicker: "PROVA 02",
        headline: "Horário nobre *nacional*.",
        body: "Eliana, Tirullipa e os programas de maior audiência do SBT. Escritos, dirigidos e produzidos daqui.",
      },
      {
        kicker: "PROVA 03",
        headline: "Rede própria de *criadores*.",
        body: "DescoCreators: curadoria de talentos do interior paulista com briefing real antes de qualquer entrevista.",
      },
      {
        kicker: "PROVA 04",
        headline: "Dez anos de operação *contínua*.",
        body: "Não por falta de opção. Por escolha. A distância é o que nos permite ver o óbvio antes.",
      },
    ],
    meta: { client: "Desco", discipline: "Cultura", year: "4 provas" },
    caption: `Interior não é periferia. Quatro provas.

01 — Setores diferentes, o mesmo critério.
02 — Horário nobre nacional, escrito e dirigido daqui.
03 — Rede própria de criadores do interior.
04 — Dez anos de operação contínua.

Deslize para ver cada uma.

→ Compartilhe com quem ainda acha que marca se pensa só na capital.

${TAGS_BASE} #InteriorNãoÉPeriferia #QuatroProvas #Bauru #Carrossel`,
    imagePrompt:
      "Ultra-wide panoramic sunset over a rural road leading to the horizon, dramatic golden light, long horizontal composition designed to be sliced into five vertical frames, cinematic anamorphic look, --ar 21:9 --style raw --v 6",
    background: photo(32604507, "color", "Zülfü Demir / Pexels"),
  },
  {
    id: 50,
    slug: "sem-formulario",
    pillar: "interior",
    archetype: "kinetic",
    theme: "dark",
    tag: "CONTATO DIRETO / 05",
    headline: "Sem formulário. Sem funil. *Escreva*.",
    subheadline: "Escreva o que está travando a marca — respondemos com uma pergunta melhor.",
    meta: { client: "Desco", discipline: "Contato direto", year: "05" },
    caption: `Sem formulário. Sem funil.

Escreva o que está travando a marca. Uma frase basta. Respondemos com uma pergunta melhor — e, se fizer sentido, uma conversa.

Av. Getúlio Vargas, 22-25 · Jardim Europa · Bauru/SP.

→ Link na bio. Ou a DM mesmo.

${TAGS_BASE} #ContatoDireto #SemFunil #Escreva #Motion`,
    imagePrompt:
      "Glowing acid-green wireframe grid bending toward a vanishing point on pure black, subtle bloom and chromatic aberration, generative technical art, precise and minimal, --ar 4:5 --style raw --v 6",
    background: shader("grid", 150),
  },
];

export const POST_COUNT = postsData.length;
