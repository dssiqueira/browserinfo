# Informações Avançadas no BrowserInfo

## Visão Geral

A aba "Avançado" do BrowserInfo fornece informações detalhadas sobre o ambiente de navegação, indo além dos dados básicos. Esta documentação explica como essas informações são coletadas, processadas e exibidas ao usuário.

## Implementação da Aba Avançada

A aba "Avançado" foi implementada para fornecer informações mais detalhadas que são úteis para desenvolvedores e profissionais de QA, mas que não são necessárias para todos os usuários. Esta separação mantém a interface limpa e organizada.

```javascript
// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
  // Configurar sistema de abas
  setupTabs();
  
  // Coletar informações básicas imediatamente
  await collectBrowserInfo();
  
  // Carregar informações avançadas apenas quando a aba for clicada
  document.querySelector('.tab-button[data-tab="advanced"]').addEventListener('click', function() {
    loadAdvancedInfo();
  });
});
```

## Categorias de Informações Avançadas

### 1. Informações de Rede

#### Tipo de Conexão

O BrowserInfo utiliza a API `NetworkInformation` para obter informações sobre a conexão de rede do usuário:

```javascript
function getConnectionInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    // Tipo de conexão (wifi, cellular, ethernet, etc)
    document.getElementById('connection-type').textContent = connection.effectiveType || connection.type || "Desconhecido";
    
    // Velocidade estimada em Mbps
    if (connection.downlink) {
      document.getElementById('connection-speed').textContent = `${connection.downlink} Mbps`;
    } else {
      document.getElementById('connection-speed').textContent = "Informação não disponível";
    }
  } else {
    document.getElementById('connection-type').textContent = "API não suportada";
    document.getElementById('connection-speed').textContent = "API não suportada";
  }
}
```

#### Status Online

A extensão verifica se o usuário está online ou offline usando a propriedade `navigator.onLine`:

```javascript
function checkOnlineStatus() {
  const isOnline = navigator.onLine;
  document.getElementById('online-status').textContent = isOnline ? "Online" : "Offline";
  
  // Adicionar listener para mudanças no status
  window.addEventListener('online', () => {
    document.getElementById('online-status').textContent = "Online";
  });
  
  window.addEventListener('offline', () => {
    document.getElementById('online-status').textContent = "Offline";
  });
}
```

### 2. Informações de Hardware

#### Núcleos de CPU

O BrowserInfo utiliza `navigator.hardwareConcurrency` para obter o número de núcleos lógicos disponíveis para o navegador:

```javascript
function getCPUInfo() {
  if (navigator.hardwareConcurrency) {
    document.getElementById('cpu-cores').textContent = `${navigator.hardwareConcurrency} núcleos lógicos`;
  } else {
    document.getElementById('cpu-cores').textContent = "Informação não disponível";
  }
}
```

#### Informações de GPU

A extensão utiliza a API WebGL para obter informações sobre a GPU do dispositivo:

```javascript
function getGPUInfo() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        
        document.getElementById('gpu-info').textContent = `${vendor} - ${renderer}`;
      } else {
        document.getElementById('gpu-info').textContent = "Informações detalhadas não disponíveis";
      }
    } else {
      document.getElementById('gpu-info').textContent = "WebGL não suportado";
    }
  } catch (e) {
    document.getElementById('gpu-info').textContent = "Erro ao obter informações";
  }
}
```

#### Memória Disponível

Quando disponível, a extensão tenta obter informações sobre a memória do dispositivo:

```javascript
function getMemoryInfo() {
  if (navigator.deviceMemory) {
    document.getElementById('memory-info').textContent = `${navigator.deviceMemory} GB`;
  } else {
    document.getElementById('memory-info').textContent = "Informação não disponível";
  }
}
```

### 3. Informações de Localização

#### Idioma

O BrowserInfo obtém informações sobre o idioma configurado no navegador:

```javascript
function getLanguageInfo() {
  const languages = navigator.languages || [navigator.language || navigator.userLanguage];
  document.getElementById('language-info').textContent = languages.join(', ');
}
```

#### Fuso Horário

A extensão obtém o fuso horário do usuário utilizando a API `Intl`:

```javascript
function getTimezoneInfo() {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('timezone-info').textContent = timezone;
  } catch (e) {
    document.getElementById('timezone-info').textContent = new Date().getTimezoneOffset() / -60 + " horas (UTC)";
  }
}
```

### 4. Cookies e Armazenamento

#### Status de Cookies

A extensão verifica se os cookies estão habilitados no navegador:

```javascript
function checkCookiesEnabled() {
  document.getElementById('cookies-enabled').textContent = navigator.cookieEnabled ? "Habilitados" : "Desabilitados";
}
```

#### Cookies de Terceiros

Para verificar o suporte a cookies de terceiros, a extensão utiliza uma técnica de detecção indireta:

```javascript
function checkThirdPartyCookies() {
  // Esta é uma verificação simplificada
  // Uma implementação completa envolveria um iframe de outro domínio
  
  try {
    const testValue = "testThirdPartyCookies";
    document.cookie = "thirdPartyTest=" + testValue + "; SameSite=None; Secure";
    
    const cookieEnabled = document.cookie.indexOf("thirdPartyTest=") !== -1;
    document.getElementById('third-party-cookies').textContent = cookieEnabled ? "Provavelmente permitidos" : "Possivelmente bloqueados";
    
    // Limpar o cookie de teste
    document.cookie = "thirdPartyTest=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
  } catch (e) {
    document.getElementById('third-party-cookies').textContent = "Não foi possível determinar";
  }
}
```

#### LocalStorage Disponível

A extensão verifica a disponibilidade do localStorage:

```javascript
function checkLocalStorage() {
  try {
    const testKey = "browserInfoTest";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    document.getElementById('local-storage').textContent = "Disponível";
  } catch (e) {
    document.getElementById('local-storage').textContent = "Indisponível";
  }
}
```

## Carregamento Sob Demanda

Para otimizar o desempenho, as informações avançadas são carregadas apenas quando o usuário seleciona a aba "Avançado":

```javascript
function loadAdvancedInfo() {
  // Verificar se as informações já foram carregadas
  if (document.getElementById('connection-type').textContent === "Carregando...") {
    // Informações de Rede
    getConnectionInfo();
    checkOnlineStatus();
    
    // Informações de Hardware
    getCPUInfo();
    getMemoryInfo();
    getGPUInfo();
    
    // Informações de Localização
    getLanguageInfo();
    getTimezoneInfo();
    
    // Cookies e Armazenamento
    checkCookiesEnabled();
    checkThirdPartyCookies();
    checkLocalStorage();
  }
}
```

## Desafios de Implementação

### Compatibilidade entre Navegadores

Nem todas as APIs estão disponíveis em todos os navegadores, por isso a extensão implementa verificações de disponibilidade e fallbacks:

```javascript
// Exemplo de verificação de disponibilidade
if (navigator.connection || navigator.mozConnection || navigator.webkitConnection) {
  // API disponível, usar
} else {
  // API não disponível, usar fallback ou mostrar mensagem
}
```

### Permissões e Privacidade

Algumas informações podem requerer permissões específicas ou podem ser limitadas por políticas de privacidade:

1. **Informações de Hardware**: Alguns navegadores limitam o acesso a informações detalhadas de hardware
2. **Informações de Rede**: Detalhes precisos sobre a rede podem ser limitados
3. **Geolocalização**: Acesso à localização precisa requer permissão explícita do usuário

### Informações Dinâmicas

Algumas informações podem mudar durante a sessão do usuário:

```javascript
// Exemplo de listener para mudanças na conexão
if (navigator.connection) {
  navigator.connection.addEventListener('change', function() {
    // Atualizar informações de conexão quando mudarem
    getConnectionInfo();
  });
}
```

## Organização da Interface

As informações avançadas são organizadas em cards temáticos para melhor usabilidade:

```html
<!-- Exemplo de estrutura HTML para informações avançadas -->
<div id="advanced" class="tab-content">
  <!-- Informações de Rede -->
  <div class="info-container">
    <h3>Informações de Rede</h3>
    <div class="info-section">
      <!-- Itens de informação -->
    </div>
  </div>
  
  <!-- Outras categorias de informação -->
</div>
```

## Evolução das Informações Avançadas

A implementação das informações avançadas foi uma adição significativa à extensão, expandindo suas capacidades além das informações básicas iniciais. Esta evolução reflete a necessidade de fornecer dados mais detalhados para casos de uso específicos, como testes de compatibilidade e depuração.

## Considerações Futuras

Possíveis melhorias para a seção de informações avançadas incluem:

1. **Mais Detalhes de Hardware**: Informações mais detalhadas sobre GPU, quando disponíveis
2. **Capacidades de Mídia**: Detecção de suporte a formatos de áudio/vídeo
3. **Recursos Web Avançados**: Verificação de suporte a APIs web modernas
4. **Informações de Segurança**: Detecção de configurações de segurança do navegador
5. **Métricas de Performance**: Adição de benchmarks simples para avaliar o desempenho do navegador

---

Próximo: [Notificações](./Notificacoes.md)
