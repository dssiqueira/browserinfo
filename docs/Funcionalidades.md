# Funcionalidades do BrowserInfo

## Visão Geral

O BrowserInfo oferece um conjunto abrangente de funcionalidades projetadas para coletar, exibir e compartilhar informações detalhadas sobre o ambiente de navegação. Esta documentação detalha cada funcionalidade principal da extensão.

## Coleta de Informações Básicas

### Detecção do Navegador

A extensão identifica com precisão o navegador em uso, incluindo:
- Google Chrome
- Microsoft Edge (baseado em Chromium)
- Mozilla Firefox
- Opera
- Apple Safari

A detecção é realizada através da análise da string `userAgent` e implementa lógica específica para diferenciar corretamente entre navegadores similares (como Chrome e Edge, que compartilham componentes Chromium).

```javascript
// Exemplo de código de detecção do navegador
function getBrowserName() {
  const userAgent = navigator.userAgent;
  
  // A ordem é importante! Edge contém Chrome na string user agent
  if (userAgent.match(/edg/i)) {
    return "Microsoft Edge";
  } else if (userAgent.match(/chrome|chromium|crios/i)) {
    return "Google Chrome";
  }
  // Outros navegadores...
}
```

### Detecção de Versão Completa

A extensão obtém a versão completa do navegador, incluindo todos os números da build (ex: 137.0.3296.83), utilizando:

1. **API navigator.userAgentData** (método moderno)
   - Solicita dados de "alta entropia" que incluem a versão completa
   - Implementação assíncrona para obter informações detalhadas

2. **Análise do userAgent** (método tradicional como fallback)
   - Expressões regulares específicas para cada navegador
   - Padrões otimizados para capturar a versão completa

### Informações do Sistema Operacional

Detecta o sistema operacional do usuário e sua arquitetura (32/64 bits), incluindo:
- Windows (com versão)
- macOS
- Linux (com distribuição, quando possível)
- Android
- iOS

### Resolução de Tela

Coleta informações sobre a resolução da tela, incluindo:
- Resolução da janela do navegador
- Resolução total da tela
- Densidade de pixels (quando disponível)

### URL Atual

Captura a URL completa da página atual que o usuário está visitando, utilizando a API `chrome.tabs` para acessar informações da aba ativa.

## Coleta de Informações Avançadas

### Informações de Rede

- **Tipo de Conexão**: Detecta se o usuário está usando WiFi, ethernet, celular, etc.
- **Velocidade Estimada**: Fornece uma estimativa da velocidade de conexão quando disponível
- **Status Online**: Verifica se o usuário está online ou offline

```javascript
// Exemplo de código para informações de rede
function getNetworkInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    return {
      type: connection.effectiveType || connection.type || "Desconhecido",
      downlink: connection.downlink ? `${connection.downlink} Mbps` : "Desconhecido",
      rtt: connection.rtt ? `${connection.rtt} ms` : "Desconhecido"
    };
  }
  
  return {
    type: "Informação não disponível",
    downlink: "Desconhecido",
    rtt: "Desconhecido"
  };
}
```

### Informações de Hardware

- **Núcleos de CPU**: Número de núcleos lógicos disponíveis para o navegador
- **Informações de GPU**: Detalhes sobre a GPU através da API WebGL
- **Memória Disponível**: Informações sobre memória quando disponível

### Informações de Localização

- **Idioma**: Idioma configurado no navegador
- **Fuso Horário**: Fuso horário do usuário

### Cookies e Armazenamento

- **Status de Cookies**: Verifica se os cookies estão habilitados
- **Cookies de Terceiros**: Verifica o suporte a cookies de terceiros
- **LocalStorage**: Verifica a disponibilidade de localStorage

## Sistema de Abas

A extensão implementa um sistema de abas que permite ao usuário alternar facilmente entre diferentes conjuntos de informações:

1. **Aba Básico**: Exibe informações essenciais (navegador, versão, SO, resolução, URL)
2. **Aba Avançado**: Exibe informações detalhadas organizadas em categorias

O sistema de abas é implementado com JavaScript puro, sem dependências externas:

```javascript
// Exemplo simplificado do sistema de abas
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remover classe ativa de todos os botões e conteúdos
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Adicionar classe ativa ao botão clicado
      this.classList.add('active');
      
      // Mostrar o conteúdo correspondente
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}
```

## Sistema de Notificações

A extensão implementa um sistema de notificações elegante que:

1. Exibe mensagens de feedback ao usuário
2. Suporta diferentes tipos de notificações (sucesso, erro)
3. Inclui animações de entrada e saída suaves
4. Desaparece automaticamente após 3 segundos

```javascript
// Exemplo do sistema de notificações
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  
  // Definir o tipo de notificação
  notification.className = 'notification';
  if (type === 'error') {
    notification.classList.add('error');
  }
  
  // Definir a mensagem
  notification.textContent = message;
  
  // Mostrar a notificação
  notification.classList.add('show');
  
  // Esconder a notificação após 3 segundos
  setTimeout(function() {
    notification.classList.remove('show');
  }, 3000);
}
```

## Exportação de Dados

### Cópia para Área de Transferência

A extensão permite copiar todas as informações coletadas para a área de transferência em formato Markdown:

```javascript
// Exemplo de exportação em Markdown
function copyInfoToClipboard() {
  // Criar texto formatado em Markdown
  const formattedText = `
## Informações do Navegador

- **Navegador:** ${browserInfo.name}
- **Versão:** ${browserInfo.detailedVersion || browserInfo.version}
- **Sistema Operacional:** ${browserInfo.os}
- **Resolução:** ${browserInfo.resolution}
- **URL Atual:** ${browserInfo.url}

*Gerado por BrowserInfo em ${new Date().toLocaleString()}*
`;
  
  // Copiar para a área de transferência
  navigator.clipboard.writeText(formattedText.trim())
    .then(() => {
      showNotification('Informações copiadas com sucesso!', 'success');
    })
    .catch(err => {
      showNotification('Erro ao copiar informações: ' + err, 'error');
    });
}
```

O formato Markdown foi escolhido como padrão por oferecer uma boa formatação que funciona bem em várias plataformas de documentação e comunicação.

## Carregamento Sob Demanda

Para otimizar o desempenho, a extensão implementa um sistema de carregamento sob demanda para informações avançadas:

1. As informações básicas são carregadas imediatamente quando o popup é aberto
2. As informações avançadas são carregadas apenas quando o usuário clica na aba "Avançado"

```javascript
// Exemplo de carregamento sob demanda
document.querySelector('.tab-button[data-tab="advanced"]').addEventListener('click', function() {
  // Carregar informações avançadas apenas quando necessário
  loadAdvancedInfo();
});
```

## Detecção de Plugins e Extensões

A extensão também pode coletar informações sobre plugins instalados no navegador, embora esta seja uma tecnologia legada em navegadores modernos:

```javascript
// Exemplo de detecção de plugins
function listInstalledPlugins() {
  if (navigator.plugins && navigator.plugins.length > 0) {
    // Processar plugins disponíveis
    Array.from(navigator.plugins).forEach(plugin => {
      // Exibir informações do plugin
    });
  } else {
    // Informar que não há plugins ou que não estão acessíveis
  }
}
```

## Evolução das Funcionalidades

O BrowserInfo passou por várias iterações, com funcionalidades sendo adicionadas, refinadas ou simplificadas:

1. **Versão Inicial**: Coleta básica de informações do navegador
2. **Adição de Exportação**: Implementação de cópia em múltiplos formatos
3. **Simplificação da Interface**: Remoção do botão "Exportar TXT" e padronização no formato Markdown
4. **Adição de Informações Avançadas**: Implementação da aba com informações detalhadas
5. **Melhoria na Detecção**: Refinamento dos algoritmos de detecção de navegador e versão
6. **Otimização**: Remoção de funções de debug e foco nas funcionalidades essenciais

---

Próximo: [Detecção de Navegador](./DeteccaoNavegador.md)
