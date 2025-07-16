// Classe principal para gerenciar o BrowserInfo
class BrowserInfoManager {
  constructor() {
    this.infoCollected = false;
    this.advancedInfoLoaded = false;
    this.darkMode = false;
    this.browserInfo = {
      name: '',
      version: '',
      detailedVersion: '',
      os: '',
      resolution: '',
      url: ''
    };
    this.cache = new Map();
  }

  // Inicializar a aplicação
  async init() {
    try {
      this.setupTabs();
      this.setupDarkMode();
      await this.collectBrowserInfo();
      this.setupEventListeners();
    } catch (error) {
      console.error('Erro na inicialização:', error);
      this.showNotification('Erro ao inicializar a extensão', 'error');
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
      copyButton.addEventListener('click', () => this.copyInfoToClipboard());
    }

    const advancedTab = document.querySelector('.tab-button[data-tab="advanced"]');
    if (advancedTab) {
      advancedTab.addEventListener('click', () => this.loadAdvancedInfo());
    }
  }

  // Configurar modo escuro
  setupDarkMode() {
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('browserinfo-theme');
    if (savedTheme === 'dark') {
      this.darkMode = true;
      document.body.classList.add('dark-mode');
    }

    // Criar botão de alternância
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.title = 'Alternar tema claro/escuro';
    themeToggle.setAttribute('aria-label', 'Alternar tema');

    // O CSS já define os ícones via ::before, não precisamos de innerHTML

    themeToggle.addEventListener('click', () => {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode');

      localStorage.setItem('browserinfo-theme', this.darkMode ? 'dark' : 'light');
      this.showNotification(`Tema ${this.darkMode ? 'escuro' : 'claro'} ativado`, 'success');
    });

    const container = document.querySelector('.container');
    if (container) {
      container.insertBefore(themeToggle, container.firstChild);
    }
  }

  // Configurar sistema de abas
  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Remover classe ativa de todos os botões e conteúdos
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        tabContents.forEach(content => content.classList.remove('active'));

        // Adicionar classe ativa ao botão clicado
        e.target.classList.add('active');
        e.target.setAttribute('aria-selected', 'true');

        // Mostrar o conteúdo correspondente
        const tabId = e.target.getAttribute('data-tab');
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });

      // Suporte para navegação por teclado
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });
  }

  // Mostrar notificação
  showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    // Definir o tipo de notificação
    notification.className = 'notification';
    if (type === 'error') {
      notification.classList.add('error');
    } else if (type === 'warning') {
      notification.classList.add('warning');
    }

    // Definir a mensagem
    notification.textContent = message;

    // Mostrar a notificação
    notification.classList.add('show');

    // Esconder a notificação após 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  // Detectar o nome do navegador
  getBrowserName() {
    if (this.cache.has('browserName')) {
      return this.cache.get('browserName');
    }

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

    this.cache.set('browserName', browserName);
    return browserName;
  }

  // Obter a versão básica do navegador
  getBrowserVersion() {
    if (this.cache.has('browserVersion')) {
      return this.cache.get('browserVersion');
    }

    const userAgent = navigator.userAgent;
    let version = "Desconhecida";

    try {
      // Extrair versão com base no navegador
      if (userAgent.match(/edg/i)) {
        const match = userAgent.match(/edg\/([\d.]+)/i);
        version = match ? match[1] : "Desconhecida";
      } else if (userAgent.match(/opr\//i) || userAgent.match(/opera/i)) {
        const match = userAgent.match(/(?:opr|opera)\/([\d.]+)/i);
        version = match ? match[1] : "Desconhecida";
      } else if (userAgent.match(/firefox|fxios/i)) {
        const match = userAgent.match(/(?:firefox|fxios)\/([\d.]+)/i);
        version = match ? match[1] : "Desconhecida";
      } else if (userAgent.match(/chrome|chromium|crios/i)) {
        const match = userAgent.match(/(?:chrome|chromium|crios)\/([\d.]+)/i);
        version = match ? match[1] : "Desconhecida";
      } else if (userAgent.match(/safari/i)) {
        const match = userAgent.match(/version\/([\d.]+)/i);
        version = match ? match[1] : "Desconhecida";
      }
    } catch (error) {
      console.warn('Erro ao extrair versão do navegador:', error);
    }

    this.cache.set('browserVersion', version);
    return version;
  }

  // Obter versão detalhada do navegador
  async getDetailedBrowserVersion() {
    if (this.cache.has('detailedBrowserVersion')) {
      return this.cache.get('detailedBrowserVersion');
    }

    let detailedVersion = "";

    try {
      const browserName = this.getBrowserName().toLowerCase();

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

        // Adicionar informações da plataforma (usando detecção correta do SO)
        if (uaData.platform && uaData.platformVersion) {
          // Usar a detecção correta do Windows 11
          if (uaData.platform === "Windows") {
            const version = parseFloat(uaData.platformVersion);
            if (version >= 13.0) {
              detailedVersion += ` (Windows 11)`;
            } else if (version >= 10.0) {
              detailedVersion += ` (Windows 10)`;
            } else {
              detailedVersion += ` (${uaData.platform} ${uaData.platformVersion})`;
            }
          } else {
            detailedVersion += ` (${uaData.platform} ${uaData.platformVersion})`;
          }
        }

        // Adicionar arquitetura
        if (uaData.architecture) {
          detailedVersion += ` [${uaData.architecture}]`;
        }
      }

      // Se não conseguimos obter dados detalhados, usar a versão básica
      if (!detailedVersion) {
        detailedVersion = this.getBrowserVersion();
      }

    } catch (error) {
      console.warn('Erro ao obter versão detalhada:', error);
      detailedVersion = this.getBrowserVersion();
    }

    this.cache.set('detailedBrowserVersion', detailedVersion);
    return detailedVersion;
  }

  // Obter o sistema operacional (com detecção melhorada do Windows 11)
  async getOS() {
    if (this.cache.has('os')) {
      return this.cache.get('os');
    }

    let os = "Desconhecido";

    try {
      // Tentar usar a API moderna primeiro
      if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
        const uaData = await navigator.userAgentData.getHighEntropyValues([
          "platform",
          "platformVersion"
        ]);

        if (uaData.platform === "Windows") {
          const version = parseFloat(uaData.platformVersion);
          // Windows 11 tem platformVersion >= 13.0
          if (version >= 13.0) {
            os = "Windows 11";
          } else if (version >= 10.0) {
            os = "Windows 10";
          } else {
            os = `Windows ${uaData.platformVersion}`;
          }
        } else if (uaData.platform) {
          os = uaData.platform;
          if (uaData.platformVersion) {
            os += ` ${uaData.platformVersion}`;
          }
        }
      }

      // Fallback para user agent tradicional se a API moderna não funcionar
      if (os === "Desconhecido") {
        const userAgent = navigator.userAgent;

        if (userAgent.match(/windows nt 10/i)) {
          // Tentar detectar Windows 11 por outras características
          // Windows 11 geralmente tem build numbers >= 22000
          const buildMatch = userAgent.match(/windows nt 10\.0.*?(\d{5,})/i);
          if (buildMatch && parseInt(buildMatch[1]) >= 22000) {
            os = "Windows 11";
          } else {
            // Verificar se é Windows 11 por outras características
            const isWindows11 = userAgent.includes('Windows NT 10.0') &&
              (userAgent.includes('22000') || userAgent.includes('22H2') ||
                new Date().getFullYear() >= 2022);
            os = isWindows11 ? "Windows 11" : "Windows 10";
          }
        } else if (userAgent.match(/windows nt 6.3/i)) {
          os = "Windows 8.1";
        } else if (userAgent.match(/windows nt 6.2/i)) {
          os = "Windows 8";
        } else if (userAgent.match(/windows nt 6.1/i)) {
          os = "Windows 7";
        } else if (userAgent.match(/mac os x/i)) {
          const versionMatch = userAgent.match(/mac os x ([\d_]+)/i);
          if (versionMatch) {
            const version = versionMatch[1].replace(/_/g, '.');
            os = `macOS ${version}`;
          } else {
            os = "macOS";
          }
        } else if (userAgent.match(/linux/i)) {
          os = "Linux";
        } else if (userAgent.match(/android/i)) {
          const versionMatch = userAgent.match(/android ([\d.]+)/i);
          if (versionMatch) {
            os = `Android ${versionMatch[1]}`;
          } else {
            os = "Android";
          }
        } else if (userAgent.match(/iphone|ipad|ipod/i)) {
          const versionMatch = userAgent.match(/os ([\d_]+)/i);
          if (versionMatch) {
            const version = versionMatch[1].replace(/_/g, '.');
            os = `iOS ${version}`;
          } else {
            os = "iOS";
          }
        }
      }
    } catch (error) {
      console.warn('Erro ao detectar sistema operacional:', error);
      // Fallback básico
      const userAgent = navigator.userAgent;
      if (userAgent.match(/windows/i)) {
        os = "Windows";
      } else if (userAgent.match(/mac/i)) {
        os = "macOS";
      } else if (userAgent.match(/linux/i)) {
        os = "Linux";
      }
    }

    this.cache.set('os', os);
    return os;
  }

  // Coletar informações do navegador
  async collectBrowserInfo() {
    if (this.infoCollected) {
      return;
    }

    try {
      // Mostrar indicadores de carregamento
      this.setLoadingState(true);

      // Coletar informações básicas
      this.browserInfo.name = this.getBrowserName();
      this.browserInfo.version = this.getBrowserVersion();
      this.browserInfo.detailedVersion = await this.getDetailedBrowserVersion();
      this.browserInfo.os = await this.getOS();
      this.browserInfo.resolution = `${window.screen.width}x${window.screen.height}`;

      // Obter URL atual da aba ativa
      if (chrome && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs[0]) {
            this.browserInfo.url = this.sanitizeUrl(tabs[0].url);
            const urlElement = document.getElementById('current-url');
            if (urlElement) {
              urlElement.textContent = this.browserInfo.url;
            }
          }
        });
      }

      // Preencher os elementos HTML com as informações coletadas
      this.updateBasicInfoDisplay();

      // Marcar que as informações foram coletadas
      this.infoCollected = true;

    } catch (error) {
      console.error('Erro ao coletar informações:', error);
      this.showNotification('Erro ao coletar algumas informações', 'warning');
    } finally {
      this.setLoadingState(false);
    }
  }

  // Sanitizar URL para remover informações sensíveis
  sanitizeUrl(url) {
    try {
      const urlObj = new URL(url);

      // Remover parâmetros sensíveis comuns
      const sensitiveParams = ['token', 'key', 'password', 'secret', 'auth', 'session'];
      sensitiveParams.forEach(param => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, '[REMOVIDO]');
        }
      });

      return urlObj.toString();
    } catch (error) {
      return url; // Retornar URL original se houver erro
    }
  }

  // Atualizar exibição das informações básicas
  updateBasicInfoDisplay() {
    const elements = {
      'browser-name': this.browserInfo.name,
      'browser-version': this.browserInfo.detailedVersion || this.browserInfo.version,
      'os': this.browserInfo.os,
      'resolution': this.browserInfo.resolution
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  // Definir estado de carregamento
  setLoadingState(loading) {
    const elements = ['browser-name', 'browser-version', 'os', 'resolution'];
    elements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        if (loading) {
          element.classList.add('loading');
          element.textContent = 'Carregando...';
        } else {
          element.classList.remove('loading');
        }
      }
    });
  }

  // Carregar informações avançadas
  async loadAdvancedInfo() {
    if (this.advancedInfoLoaded) {
      return;
    }

    try {
      // Informações de rede
      await this.loadNetworkInfo();

      // Informações de hardware
      await this.loadHardwareInfo();

      // Informações de localização
      this.loadLocationInfo();

      // Informações de cookies e armazenamento
      this.loadStorageInfo();

      // Listar plugins instalados
      await this.listInstalledPlugins();

      this.advancedInfoLoaded = true;

    } catch (error) {
      console.error('Erro ao carregar informações avançadas:', error);
      this.showNotification('Erro ao carregar algumas informações avançadas', 'warning');
    }
  }

  // Carregar informações de rede
  async loadNetworkInfo() {
    try {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (connection) {
        this.updateElement('connection-type', connection.effectiveType || 'Desconhecido');
        this.updateElement('connection-speed', connection.downlink ? `${connection.downlink} Mbps` : 'Desconhecido');
      } else {
        this.updateElement('connection-type', 'API não suportada');
        this.updateElement('connection-speed', 'API não suportada');
      }

      this.updateElement('online-status', navigator.onLine ? 'Online' : 'Offline');

    } catch (error) {
      console.warn('Erro ao obter informações de rede:', error);
      this.updateElement('connection-type', 'Erro ao obter informações');
      this.updateElement('connection-speed', 'Erro ao obter informações');
      this.updateElement('online-status', 'Erro ao obter informações');
    }
  }

  // Carregar informações de hardware
  async loadHardwareInfo() {
    try {
      // CPU cores
      this.updateElement('cpu-cores', navigator.hardwareConcurrency || 'Desconhecido');

      // Memória (não disponível via API do navegador por questões de segurança)
      this.updateElement('memory-info', 'Não disponível via API do navegador');

      // GPU info via WebGL
      await this.loadGPUInfo();

    } catch (error) {
      console.warn('Erro ao obter informações de hardware:', error);
    }
  }

  // Carregar informações da GPU
  async loadGPUInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          this.updateElement('gpu-info', `${vendor} - ${renderer}`);
        } else {
          this.updateElement('gpu-info', 'Informações detalhadas não disponíveis');
        }
      } else {
        this.updateElement('gpu-info', 'WebGL não suportado');
      }
    } catch (error) {
      console.warn('Erro ao obter informações da GPU:', error);
      this.updateElement('gpu-info', 'Erro ao obter informações');
    }
  }

  // Carregar informações de localização
  loadLocationInfo() {
    try {
      this.updateElement('language-info', navigator.language || 'Desconhecido');

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.updateElement('timezone-info', timezone || 'Desconhecido');

    } catch (error) {
      console.warn('Erro ao obter informações de localização:', error);
      this.updateElement('language-info', 'Erro ao obter informações');
      this.updateElement('timezone-info', 'Erro ao obter informações');
    }
  }

  // Carregar informações de armazenamento
  loadStorageInfo() {
    try {
      this.updateElement('cookies-enabled', navigator.cookieEnabled ? 'Sim' : 'Não');
      this.updateElement('third-party-cookies', 'Verificação não disponível via API');
      this.updateElement('local-storage', typeof localStorage !== 'undefined' ? 'Disponível' : 'Indisponível');

    } catch (error) {
      console.warn('Erro ao obter informações de armazenamento:', error);
      this.updateElement('cookies-enabled', 'Erro ao obter informações');
      this.updateElement('third-party-cookies', 'Erro ao obter informações');
      this.updateElement('local-storage', 'Erro ao obter informações');
    }
  }

  // Listar plugins instalados
  async listInstalledPlugins() {
    let pluginsContainer = document.getElementById('plugins-container');

    // Se não existir, criar a seção de plugins
    if (!pluginsContainer) {
      const advancedSection = document.getElementById('advanced');
      if (!advancedSection) return;

      const pluginsCard = document.createElement('div');
      pluginsCard.className = 'info-container plugins-info';

      const pluginsHeader = document.createElement('h3');
      pluginsHeader.textContent = 'Extensões e Plugins';
      pluginsCard.appendChild(pluginsHeader);

      pluginsContainer = document.createElement('div');
      pluginsContainer.id = 'plugins-container';
      pluginsCard.appendChild(pluginsContainer);

      advancedSection.appendChild(pluginsCard);
    }

    // Limpar o container
    pluginsContainer.innerHTML = '';

    try {
      // Criar seção de informações sobre extensões
      const extensionsInfo = document.createElement('div');
      extensionsInfo.className = 'extensions-info';

      // Explicar a limitação de listar extensões
      const extensionsExplanation = document.createElement('div');
      extensionsExplanation.className = 'extensions-explanation';
      extensionsExplanation.innerHTML = `
        <p><strong>Por que não posso ver minhas extensões instaladas?</strong></p>
        <p>Por motivos de segurança e privacidade, o Chrome não permite que uma extensão liste outras extensões instaladas sem permissões especiais.</p>
        <p>Para ver suas extensões instaladas, visite: <code>chrome://extensions</code></p>
      `;

      // Adicionar informações sobre a própria extensão BrowserInfo
      const thisExtensionInfo = document.createElement('div');
      thisExtensionInfo.className = 'this-extension-info';
      thisExtensionInfo.style.marginTop = '20px';

      const manifestVersion = chrome?.runtime?.getManifest?.()?.version || '1.0';
      thisExtensionInfo.innerHTML = `
        <p><strong>Sobre esta extensão:</strong></p>
        <ul class="plugins-list">
          <li class="plugin-item">
            <div class="plugin-name">BrowserInfo</div>
            <div class="plugin-description">Ferramenta para exibir informações detalhadas sobre seu navegador</div>
            <div class="plugin-filename">Versão: ${manifestVersion}</div>
          </li>
        </ul>
      `;

      extensionsInfo.appendChild(extensionsExplanation);
      extensionsInfo.appendChild(thisExtensionInfo);
      pluginsContainer.appendChild(extensionsInfo);

      // Seção de plugins (tecnologia legada)
      this.addPluginsSection(pluginsContainer);

    } catch (error) {
      console.warn('Erro ao listar plugins:', error);
      pluginsContainer.innerHTML = '<p>Erro ao carregar informações de plugins</p>';
    }
  }

  // Adicionar seção de plugins
  addPluginsSection(container) {
    const pluginsTitle = document.createElement('h4');
    pluginsTitle.textContent = 'Plugins do Navegador';
    pluginsTitle.style.marginTop = '20px';
    container.appendChild(pluginsTitle);

    const pluginsExplanation = document.createElement('p');
    pluginsExplanation.textContent = 'Plugins são tecnologias antigas (como Flash, Java, etc.) que estão sendo gradualmente removidas dos navegadores modernos.';
    container.appendChild(pluginsExplanation);

    // Verificar se a API de plugins ainda está disponível (depreciada)
    try {
      // eslint-disable-next-line deprecation/deprecation
      if (navigator.plugins && navigator.plugins.length > 0) {
        const pluginsList = document.createElement('ul');
        pluginsList.className = 'plugins-list';

        // Converter plugins em array e remover duplicatas
        const uniquePlugins = new Map();
        // eslint-disable-next-line deprecation/deprecation
        Array.from(navigator.plugins).forEach(plugin => {
          // eslint-disable-next-line deprecation/deprecation
          if (!uniquePlugins.has(plugin.name)) {
            // eslint-disable-next-line deprecation/deprecation
            uniquePlugins.set(plugin.name, plugin);
          }
        });

        // Ordenar plugins por nome
        const sortedPlugins = Array.from(uniquePlugins.values())
          // eslint-disable-next-line deprecation/deprecation
          .sort((a, b) => a.name.localeCompare(b.name));

        sortedPlugins.forEach(plugin => {
          const pluginItem = document.createElement('li');
          pluginItem.className = 'plugin-item';

          const pluginName = document.createElement('div');
          pluginName.className = 'plugin-name';
          // eslint-disable-next-line deprecation/deprecation
          pluginName.textContent = plugin.name;

          const pluginDesc = document.createElement('div');
          pluginDesc.className = 'plugin-description';
          pluginDesc.textContent = plugin.description || 'Sem descrição';

          const pluginInfo = document.createElement('div');
          pluginInfo.className = 'plugin-filename';

          const details = [];
          if (plugin.filename) details.push(`Arquivo: ${plugin.filename}`);
          if (plugin.version) details.push(`Versão: ${plugin.version}`);
          // eslint-disable-next-line deprecation/deprecation
          details.push(`Itens: ${plugin.length}`);

          pluginInfo.textContent = details.join(' | ');

          pluginItem.appendChild(pluginName);
          pluginItem.appendChild(pluginDesc);
          pluginItem.appendChild(pluginInfo);

          pluginsList.appendChild(pluginItem);
        });

        container.appendChild(pluginsList);
      } else {
        const noPlugins = document.createElement('p');
        noPlugins.textContent = 'Nenhum plugin detectado. Navegadores modernos eliminaram o suporte a plugins tradicionais.';
        container.appendChild(noPlugins);
      }
    } catch (error) {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'API de plugins não disponível neste navegador.';
      container.appendChild(errorMessage);
    }
  }

  // Função auxiliar para atualizar elementos
  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  // Copiar informações para a área de transferência
  async copyInfoToClipboard() {
    try {
      // Aguardar coleta de informações se necessário
      if (!this.infoCollected) {
        await this.collectBrowserInfo();
      }

      // Criar texto formatado em Markdown
      const formattedText = this.generateMarkdownReport();

      // Tentar usar a API moderna de clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formattedText);
        this.showNotification('Informações copiadas com sucesso!', 'success');
      } else {
        // Fallback para navegadores mais antigos
        await this.fallbackCopyToClipboard(formattedText);
      }

    } catch (error) {
      console.error('Erro ao copiar informações:', error);

      // Tentar fallback se a API moderna falhar
      try {
        await this.fallbackCopyToClipboard(this.generateMarkdownReport());
      } catch (fallbackError) {
        console.error('Erro no fallback de cópia:', fallbackError);
        this.showNotification('Erro ao copiar informações. Tente novamente.', 'error');
      }
    }
  }

  // Método fallback para cópia (para navegadores mais antigos)
  async fallbackCopyToClipboard(text) {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      try {
        // eslint-disable-next-line deprecation/deprecation
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          this.showNotification('Informações copiadas com sucesso!', 'success');
          resolve();
        } else {
          reject(new Error('Comando de cópia falhou'));
        }
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
  }

  // Gerar relatório em Markdown
  generateMarkdownReport() {
    const timestamp = new Date().toLocaleString('pt-BR');

    return `## Informações do Navegador

### Informações Básicas
- **Navegador:** ${this.browserInfo.name}
- **Versão:** ${this.browserInfo.detailedVersion || this.browserInfo.version}
- **Sistema Operacional:** ${this.browserInfo.os}
- **Resolução:** ${this.browserInfo.resolution}
- **URL Atual:** ${this.browserInfo.url || 'Não disponível'}

### Informações Técnicas
- **Idioma:** ${navigator.language || 'Desconhecido'}
- **Fuso Horário:** ${Intl.DateTimeFormat().resolvedOptions().timeZone || 'Desconhecido'}
- **Cookies Habilitados:** ${navigator.cookieEnabled ? 'Sim' : 'Não'}
- **LocalStorage:** ${typeof localStorage !== 'undefined' ? 'Disponível' : 'Indisponível'}
- **Núcleos de CPU:** ${navigator.hardwareConcurrency || 'Desconhecido'}
- **Status Online:** ${navigator.onLine ? 'Online' : 'Offline'}

---
*Relatório gerado por BrowserInfo em ${timestamp}*`;
  }
}

// Instanciar e inicializar a aplicação
const browserInfoManager = new BrowserInfoManager();

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  browserInfoManager.init();
});