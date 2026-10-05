export interface WebPageData {
  title: string;
  url: string;
  domain: string;
  favicon?: string;
  themeColor?: string;
  content: {
    headline: string;
    subheadline?: string;
    author?: string;
    date?: string;
    readingTime?: string;
    sections: {
      heading?: string;
      paragraphs: string[];
      highlight?: string;
    }[];
  };
}

export const MOCK_PAGES: Record<string, WebPageData> = {
  'certoflow.app/news': {
    title: 'CertoNews — Portal Global de Inovação e Notícias',
    url: 'https://certoflow.app/news',
    domain: 'certoflow.app',
    themeColor: '#0ea5e9',
    content: {
      headline: 'A Nova Era dos Navegadores Web Leves e Focados em Privacidade',
      subheadline: 'Como a arquitetura moderna de PWAs e motores otimizados estão transformando a navegação móvel em 2026.',
      author: 'Redação CertoNews',
      date: 'Hoje às 10:45',
      readingTime: '3 min de leitura',
      sections: [
        {
          heading: 'Velocidade e Ergonomia na Palma da Mão',
          paragraphs: [
            'Os utilizadores móveis passam mais de 70% do tempo de navegação segurando o telemóvel com apenas uma mão. Navegadores com ergonomia de polegar (Thumb-Zone) e transições a 60 frames por segundo definem o novo padrão de usabilidade.',
            'O CertoFlow introduz a gestão inteligente de guias e atalhos flutuantes, garantindo que qualquer ação crítica esteja a um toque de distância sem fadiga na mão.'
          ],
          highlight: 'Menos latência, mais autonomia de bateria e privacidade sem compromissos.'
        },
        {
          heading: 'Proteção Ativa contra Rastreadores',
          paragraphs: [
            'Com a remoção definitiva de cookies de terceiros na web moderna, sistemas locais de filtragem de anúncios e telemetria oferecem uma experiência limpa, acelerando o carregamento de páginas em até 4 vezes.',
            'As diretrizes de design minimalista aliadas a controles de zoom e modo computador garantem total flexibilidade para qualquer dispositivo.'
          ]
        }
      ]
    }
  },
  'certoflow.app/tech': {
    title: 'TechPulse — Tendências Tecnológicas & Desenvolvimento',
    url: 'https://certoflow.app/tech',
    domain: 'certoflow.app',
    themeColor: '#8b5cf6',
    content: {
      headline: 'WebAssembly e PWAs: O Fim da Linha para Aplicações Nativas Pesadas?',
      subheadline: 'O ecossistema móvel atinge maturidade com aplicações web que se comportam e respondem exatamente como apps nativos.',
      author: 'Equipa de Engenharia',
      date: 'Ontem',
      readingTime: '5 min de leitura',
      sections: [
        {
          heading: 'Desempenho Próximo do Metal',
          paragraphs: [
            'A evolução dos motores JavaScript modernos permite renderização fluida com aceleração de hardware GPU direta no navegador.',
            'Com interfaces baseadas em glassmorphism e microinterações táteis, a distinção visual entre uma PWA e um aplicativo compilado em C++ ou Kotlin praticamente desapareceu.'
          ],
          highlight: 'A web aberta é a plataforma definitiva de distribuição sem taxas de lojas de apps.'
        },
        {
          heading: 'O Futuro dos Dispositivos Dobráveis e Tablets',
          paragraphs: [
            'Com a proliferação de tablets com teclado e telas dobráveis, navegadores precisam se adaptar instantaneamente entre o layout vertical de telemóvel e o modo horizontal com múltiplas colunas.'
          ]
        }
      ]
    }
  },
  'pt.wikipedia.org': {
    title: 'Navegador web — Wikipédia, a enciclopédia livre',
    url: 'https://pt.wikipedia.org',
    domain: 'wikipedia.org',
    themeColor: '#334155',
    content: {
      headline: 'Navegador Web (Web Browser)',
      subheadline: 'Programa de computador desenvolvido com o objetivo de permitir a navegação pela World Wide Web.',
      author: 'Contribuidores da Wikipédia',
      date: 'Atualizado recentemente',
      readingTime: '6 min de leitura',
      sections: [
        {
          heading: 'História e Evolução',
          paragraphs: [
            'O primeiro navegador web, chamado WorldWideWeb, foi criado em 1990 por Tim Berners-Lee no CERN. Mais tarde, com o Mosaic em 1993 e o Netscape Navigator em 1994, a navegação gráfica popularizou-se em escala planetária.',
            'Nas décadas seguintes, surgiram pioneiros como Opera, Mozilla Firefox, Google Chrome e motores de renderização como WebKit e Blink.'
          ]
        },
        {
          heading: 'Arquitetura e Recursos Modernos',
          paragraphs: [
            'Navegadores contemporâneos integram isolamento de processos por guia (sandbox), suporte a WebGL, aceleração por hardware e arquitetura de gestão de privacidade integrada.',
            'A usabilidade móvel impulsionou inovações como gestos táteis, modos escuros adaptativos e gestores visuais de abas em cartões dinâmicos.'
          ],
          highlight: 'O navegador é hoje o principal sistema operacional dentro de qualquer dispositivo eletrônico.'
        }
      ]
    }
  }
};
