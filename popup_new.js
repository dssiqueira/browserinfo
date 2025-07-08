// Variáveis globais
let darkMode = false;
let infoCollected = false;
let browserInfo = {
  name: '',
  version: '',
  detailedVersion: '',
  os: '',
  resolution: '',
  url: ''
};

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
  // Configurar sistema de abas
  setupTabs();
  
  // Configurar modo escuro
  setupDarkMode();
  
  // Coletar informações do navegador
  await collectBrowserInfo();
  
  // Configurar botão de cópia
  document.getElementById('copy-button').addEventListener('click', function() {
    copyInfoToClipboard('markdown');
  });
  
  // Carregar informações avançadas quando a aba avançada for clicada
  document.querySelector('.tab-button[data-tab="advanced"]').addEventListener('click', function() {
    loadAdvancedInfo();
  });
});

// Função para configurar o sistema de abas
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

// Função para configurar o modo escuro
function setupDarkMode() {
  // Criar o botão de alternar tema
  const themeToggle = document.createElement('button');
  themeToggle.id = 'theme-toggle';
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '<span class="theme-icon">&#9681;</span>';
  themeToggle.title = 'Alternar tema claro/escuro';
  
  // Verificar preferência do usuário salva
  const savedTheme = localStorage.getItem('browserinfo-theme');
  if (savedTheme === 'dark') {
    darkMode = true;
    document.body.classList.add('dark-mode');
    themeToggle.classList.add('dark');
  }
  
  // Adicionar evento de clique
  themeToggle.addEventListener('click', function() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    themeToggle.classList.toggle('dark');
    
    // Salvar preferência
    localStorage.setItem('browserinfo-theme', darkMode ? 'dark' : 'light');
    
    // Mostrar notificação
    showNotification(`Tema ${darkMode ? 'escuro' : 'claro'} ativado`, 'success');
  });
  
  // Adicionar o botão ao topo da página
  const container = document.querySelector('.container');
  if (container) {
    container.insertBefore(themeToggle, container.firstChild);
  } else {
    document.body.insertBefore(themeToggle, document.body.firstChild);
  }
}

// Função para mostrar notificação
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  
  // Definir o tipo de notificação (sucesso ou erro)
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

// Função para detectar o nome do navegador
function getBrowserName() {
  const userAgent = navigator.userAgent;
  let browserName;
  
  // A ordem é importante! Edge contém Chrome na string user agent
  if (userAgent.match(/edg/i)) {
    browserName = "Microsoft Edge";
  } else if (userAgent.match(/opr\//i) || userAgent.match(/opera/i)) {
    browserName = "Opera";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Mozilla Firefox";
  } else if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Google Chrome";
  } else if (userAgent.match(/safari/i)) {
    browserName = "Apple Safari";
  } else {
    browserName = "Desconhecido";
  }
  
  return browserName;
}

// Função para obter a versão básica do navegador
function getBrowserVersion() {
  const userAgent = navigator.userAgent;
  let version = "Desconhecida";
  
  // Extrair versão com base no navegador
  if (userAgent.match(/edg/i)) {
    version = userAgent.match(/edg\/([\d.]+)/i)[1];
  } else if (userAgent.match(/opr\//i) || userAgent.match(/opera/i)) {
    version = userAgent.match(/(?:opr|opera)\/([\d.]+)/i)[1];
  } else if (userAgent.match(/firefox|fxios/i)) {
    version = userAgent.match(/(?:firefox|fxios)\/([\d.]+)/i)[1];
  } else if (userAgent.match(/chrome|chromium|crios/i)) {
    version = userAgent.match(/(?:chrome|chromium|crios)\/([\d.]+)/i)[1];
  } else if (userAgent.match(/safari/i)) {
    version = userAgent.match(/version\/([\d.]+)/i)[1];
  }
  
  return version;
}

// Função para obter versão detalhada do navegador
async function getDetailedBrowserVersion() {
  let detailedVersion = "";
  
  try {
    const browserName = getBrowserName().toLowerCase();
    
    // Tentar obter dados de alta entropia se disponíveis
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
      const uaData = await navigator.userAgentData.getHighEntropyValues([
        "architecture",
        "model",
        "platform",
        "platformVersion",
        "fullVersionList"
      ]);
      
      // Encontrar a versão completa do navegador atual
      if (uaData.fullVersionList) {
        const browserInfo = uaData.fullVersionList.find(b => 
          b.brand.toLowerCase().includes(browserName) || 
          (browserName === "google chrome" && b.brand.toLowerCase().includes("chromium"))
        );
        
        if (browserInfo) {
          detailedVersion = browserInfo.version;
        }
      }
      
      // Adicionar informações da plataforma
      if (uaData.platform && uaData.platformVersion) {
        detailedVersion += ` (${uaData.platform} ${uaData.platformVersion})`;
      }
      
      // Adicionar arquitetura
      if (uaData.architecture) {
        detailedVersion += ` [${uaData.architecture}]`;
      }
    }
    
    // Se não conseguimos obter dados detalhados, usar a versão básica
    if (!detailedVersion) {
      detailedVersion = getBrowserVersion();
    }
    
    return detailedVersion;
  } catch (e) {
    return getBrowserVersion();
  }
}

// Função para obter o sistema operacional
function getOS() {
  const userAgent = navigator.userAgent;
  let os = "Desconhecido";
  
  if (userAgent.match(/windows nt 10/i)) {
    os = "Windows 10";
  } else if (userAgent.match(/windows nt 6.3/i)) {
    os = "Windows 8.1";
  } else if (userAgent.match(/windows nt 6.2/i)) {
    os = "Windows 8";
  } else if (userAgent.match(/windows nt 6.1/i)) {
    os = "Windows 7";
  } else if (userAgent.match(/mac os x/i)) {
    os = "macOS";
  } else if (userAgent.match(/linux/i)) {
    os = "Linux";
  } else if (userAgent.match(/android/i)) {
    os = "Android";
  } else if (userAgent.match(/iphone|ipad|ipod/i)) {
    os = "iOS";
  }
  
  return os;
}

// Função para coletar informações do navegador
async function collectBrowserInfo() {
  // Verificar se já coletamos as informações
  if (infoCollected) {
    return;
  }
  
  // Coletar informações básicas
  browserInfo.name = getBrowserName();
  browserInfo.version = getBrowserVersion();
  browserInfo.detailedVersion = await getDetailedBrowserVersion();
  browserInfo.os = getOS();
  browserInfo.resolution = `${window.screen.width}x${window.screen.height}`;
  
  // Obter URL atual da aba ativa
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs && tabs[0]) {
      browserInfo.url = tabs[0].url;
      document.getElementById('current-url').textContent = browserInfo.url;
    }
  });

  // Preencher os elementos HTML com as informações coletadas
  document.getElementById('browser-name').textContent = browserInfo.name;
  document.getElementById('browser-version').textContent = browserInfo.detailedVersion || browserInfo.version;
  document.getElementById('os').textContent = browserInfo.os;
  document.getElementById('resolution').textContent = browserInfo.resolution;
  
  // Marcar que as informações foram coletadas
  infoCollected = true;
}

// Função para carregar informações avançadas
async function loadAdvancedInfo() {
  // Verificar se já carregamos as informações avançadas
  if (document.getElementById('connection-type') && 
      document.getElementById('connection-type').textContent !== 'Carregando...') {
    return;
  }
  
  // Informações de rede
  if (navigator.connection) {
    document.getElementById('connection-type').textContent = navigator.connection.effectiveType || 'Desconhecido';
    document.getElementById('connection-speed').textContent = navigator.connection.downlink ? `${navigator.connection.downlink} Mbps` : 'Desconhecido';
    document.getElementById('online-status').textContent = navigator.onLine ? 'Online' : 'Offline';
  } else {
    document.getElementById('connection-type').textContent = 'API não suportada';
    document.getElementById('connection-speed').textContent = 'API não suportada';
    document.getElementById('online-status').textContent = navigator.onLine ? 'Online' : 'Offline';
  }
  
  // Informações de hardware
  document.getElementById('cpu-cores').textContent = navigator.hardwareConcurrency || 'Desconhecido';
  document.getElementById('memory-info').textContent = 'Não disponível via API do navegador';
  
  // Tentar obter informações da GPU via WebGL
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
        document.getElementById('gpu-info').textContent = 'Informações não disponíveis';
      }
    } else {
      document.getElementById('gpu-info').textContent = 'WebGL não suportado';
    }
  } catch (e) {
    document.getElementById('gpu-info').textContent = 'Erro ao obter informações';
  }
  
  // Informações de localização
  document.getElementById('language-info').textContent = navigator.language || 'Desconhecido';
  document.getElementById('timezone-info').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Desconhecido';
  
  // Informações de cookies e armazenamento
  document.getElementById('cookies-enabled').textContent = navigator.cookieEnabled ? 'Sim' : 'Não';
  document.getElementById('third-party-cookies').textContent = 'Verificação não disponível';
  document.getElementById('local-storage').textContent = typeof localStorage !== 'undefined' ? 'Disponível' : 'Indisponível';
  
  // Listar plugins instalados
  await listInstalledPlugins();
}

// Função para listar os plugins instalados
async function listInstalledPlugins() {
  // Verificar se o container de plugins existe
  let pluginsContainer = document.getElementById('plugins-container');
  
  // Se não existir, criar a seção de plugins
  if (!pluginsContainer) {
    // Criar card para plugins
    const advancedSection = document.getElementById('advanced');
    
    const pluginsCard = document.createElement('div');
    pluginsCard.className = 'info-container plugins-info';
    
    const pluginsHeader = document.createElement('h3');
    pluginsHeader.textContent = 'Plugins Instalados';
    pluginsCard.appendChild(pluginsHeader);
    
    pluginsContainer = document.createElement('div');
    pluginsContainer.id = 'plugins-container';
    pluginsCard.appendChild(pluginsContainer);
    
    // Adicionar o card à seção avançada
    advancedSection.appendChild(pluginsCard);
  }
  
  // Limpar o container
  pluginsContainer.innerHTML = '';
  
  // Obter lista de plugins
  if (navigator.plugins && navigator.plugins.length > 0) {
    const pluginsList = document.createElement('ul');
    pluginsList.className = 'plugins-list';
    
    // Converter a coleção de plugins em um array para facilitar a manipulação
    Array.from(navigator.plugins).forEach(plugin => {
      const pluginItem = document.createElement('li');
      pluginItem.className = 'plugin-item';
      
      const pluginName = document.createElement('div');
      pluginName.className = 'plugin-name';
      pluginName.textContent = plugin.name;
      
      const pluginDesc = document.createElement('div');
      pluginDesc.className = 'plugin-description';
      pluginDesc.textContent = plugin.description || 'Sem descrição';
      
      const pluginFile = document.createElement('div');
      pluginFile.className = 'plugin-filename';
      pluginFile.textContent = plugin.filename || '';
      
      pluginItem.appendChild(pluginName);
      pluginItem.appendChild(pluginDesc);
      pluginItem.appendChild(pluginFile);
      
      pluginsList.appendChild(pluginItem);
    });
    
    pluginsContainer.appendChild(pluginsList);
  } else {
    const noPlugins = document.createElement('p');
    noPlugins.textContent = 'Nenhum plugin detectado ou API não suportada.';
    pluginsContainer.appendChild(noPlugins);
  }
}

// Função para copiar informações para a área de transferência
function copyInfoToClipboard(format) {
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
