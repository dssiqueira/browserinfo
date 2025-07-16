# BrowserInfo

<div align="center">
  <img src="icones/BrowserInfo48.png" alt="BrowserInfo Logo" width="120"/>
  <h3>Extensão Premium para Coleta de Informações do Navegador</h3>
  <p>Uma ferramenta profissional e moderna para QAs e desenvolvedores capturarem dados precisos do navegador para evidências de testes e documentação técnica.</p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Chrome-v88+-4285f4.svg" alt="Chrome v88+"/>
  <img src="https://img.shields.io/badge/Edge-v88+-0078d4.svg" alt="Edge v88+"/>
  <img src="https://img.shields.io/badge/Opera-v74+-ff1b2d.svg" alt="Opera v74+"/>
  <img src="https://img.shields.io/badge/versão-1.0-success.svg" alt="Versão 1.0"/>
  <img src="https://img.shields.io/badge/acessibilidade-WCAG_AAA-green.svg" alt="WCAG AAA"/>
  <img src="https://img.shields.io/badge/design-premium-purple.svg" alt="Design Premium"/>
</div>

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Recursos](#-recursos)
- [Informações Coletadas](#-informações-coletadas)
- [Capturas de Tela](#-capturas-de-tela)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🔍 Visão Geral

BrowserInfo é uma extensão premium para navegadores baseados em Chromium que coleta e exibe informações detalhadas sobre o ambiente de navegação com design moderno e elegante. Desenvolvida com foco em profissionais de QA e desenvolvedores, a extensão oferece uma experiência visual sofisticada com glass morphism, gradientes elegantes e funcionalidades avançadas para captura precisa de dados do navegador.

## ✨ Recursos Premium

### 🎨 **Design Moderno**
- **Glass Morphism**: Efeitos de transparência e blur sofisticados
- **Gradientes Elegantes**: Esquema de cores roxo-azul/verde-azul harmonioso
- **Toggle Switch Animado**: Alternância suave entre temas claro/escuro com persistência
- **Cards Flutuantes**: Efeitos de elevação e sombras dinâmicas
- **Transições Suaves**: Animações cubic-bezier para experiência premium

### 🔧 **Funcionalidades Avançadas**
- **Detecção Precisa**: Windows 11, navegadores modernos e versões completas
- **Sistema de Cache**: Performance otimizada com armazenamento inteligente
- **Sanitização de URLs**: Proteção automática de dados sensíveis
- **Tratamento de Erros**: Fallbacks robustos e notificações informativas
- **Arquitetura OOP**: Código limpo e modular para manutenibilidade

### ♿ **Acessibilidade Total**
- **WCAG AAA**: Contraste otimizado em ambos os temas
- **Navegação por Teclado**: Suporte completo para Tab, Enter e Espaço
- **Labels ARIA**: Descrições detalhadas para leitores de tela
- **Focus States**: Indicadores visuais claros para navegação

### 📊 **Informações Detalhadas**
- **Básicas**: Navegador, versão, SO, resolução, URL atual
- **Avançadas**: Rede, hardware, localização, cookies, plugins
- **Exportação**: Formato Markdown para documentação técnica
- **Tempo Real**: Informações sempre atualizadas e precisas

## 📊 Informações Coletadas

### Informações Básicas
- Nome do navegador (Chrome, Firefox, Edge, Opera, Safari)
- Versão completa do navegador
- Sistema operacional e arquitetura
- Resolução de tela
- URL atual

### Informações Avançadas
- **Rede**: Tipo de conexão, velocidade estimada, status online
- **Hardware**: Núcleos de CPU, informações de GPU via WebGL
- **Localização**: Idioma, fuso horário
- **Cookies e Armazenamento**: Status de cookies, disponibilidade de localStorage

## 🖼️ Capturas de Tela

*[Adicione capturas de tela da extensão aqui]*

## 🔧 Instalação

### Método 1: Instalação Manual
1. Faça o download ou clone este repositório
2. Abra o Chrome/Edge e navegue para `chrome://extensions/`
3. Ative o "Modo do desenvolvedor" no canto superior direito
4. Clique em "Carregar sem compactação" e selecione a pasta deste projeto
5. A extensão BrowserInfo agora estará disponível na barra de ferramentas do navegador

### Método 2: Chrome Web Store
*[A ser adicionado quando a extensão for publicada na Chrome Web Store]*

## 📝 Como Usar

1. Clique no ícone da extensão na barra de ferramentas do navegador
2. A aba "Básico" exibe as informações essenciais do navegador
3. Clique na aba "Avançado" para ver informações detalhadas sobre rede, hardware, localização e cookies
4. Clique no botão "Copiar Informações" para copiar os dados no formato Markdown
5. Uma notificação confirmará que as informações foram copiadas com sucesso

## 📁 Estrutura do Projeto

```
browserinfo/
├── docs/                     # Documentação técnica detalhada
│   ├── Arquitetura.md        # Arquitetura do sistema
│   ├── Contexto.md           # Contexto e visão geral
│   ├── DeteccaoNavegador.md  # Detecção de navegadores
│   ├── ExportacaoDados.md    # Sistema de exportação
│   ├── Funcionalidades.md    # Funcionalidades detalhadas
│   ├── InformacoesAvancadas.md # Informações avançadas
│   ├── Interface.md          # Design da interface
│   └── Notificacoes.md       # Sistema de notificações
├── icones/                   # Ícones da extensão
│   ├── BrowserInfo16.png     # Ícone 16x16
│   └── BrowserInfo48.png     # Ícone 48x48
├── manifest.json             # Configuração da extensão
├── popup.html                # Interface premium com acessibilidade
├── popup.js                  # Lógica OOP com funcionalidades avançadas
├── styles.css                # Design moderno com glass morphism
└── README.md                 # Documentação completa
```

## 🛠️ Tecnologias

- **HTML5**: Estrutura da interface
- **CSS3**: Estilização com animações e efeitos visuais
- **JavaScript**: Lógica de detecção e manipulação de dados
- **Chrome Extension API**: Acesso às informações do navegador
- **Web APIs**: Navigator, Screen, Connection, WebGL

## 🚀 Roadmap

### ✅ **Implementado**
- [x] Suporte para temas claro/escuro
- [x] Acessibilidade completa (ARIA, navegação por teclado)
- [x] Tratamento robusto de erros
- [x] Sistema de cache para performance
- [x] Detecção aprimorada de SO (Windows 11, versões específicas)
- [x] Sanitização de URLs para proteção da privacidade
- [x] Arquitetura orientada a objetos

### 🔄 **Em Desenvolvimento**
- [ ] Exportação em formatos adicionais (JSON, CSV)
- [ ] Captura de screenshot da página atual
- [ ] Histórico de informações coletadas com comparação
- [ ] Configurações personalizáveis do usuário

### 📋 **Planejado**
- [ ] Suporte para Firefox via WebExtensions API
- [ ] Publicação na Chrome Web Store e Firefox Add-ons
- [ ] Testes automatizados
- [ ] Internacionalização (i18n)
- [ ] Service Worker para funcionalidades offline

## 👥 Contribuição

Contribuições são bem-vindas! Se você deseja melhorar o BrowserInfo, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

<div align="center">
  <p>Desenvolvido com ❤️ para a comunidade de QA e desenvolvimento</p>
</div>
