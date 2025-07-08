# BrowserInfo

<div align="center">
  <img src="icones/BrowserInfo48.png" alt="BrowserInfo Logo" width="120"/>
  <h3>Extensão para coleta de informações do navegador</h3>
  <p>Uma ferramenta essencial para QAs e desenvolvedores capturarem dados precisos do navegador para evidências de testes.</p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Chrome-v88+-blue.svg" alt="Chrome v88+"/>
  <img src="https://img.shields.io/badge/Edge-v88+-blue.svg" alt="Edge v88+"/>
  <img src="https://img.shields.io/badge/Firefox-v86+-orange.svg" alt="Firefox v86+"/>
  <img src="https://img.shields.io/badge/Opera-v74+-red.svg" alt="Opera v74+"/>
  <img src="https://img.shields.io/badge/versão-1.0-green.svg" alt="Versão 1.0"/>
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

BrowserInfo é uma extensão para navegadores baseados em Chromium que coleta e exibe informações detalhadas sobre o ambiente de navegação. Projetada especialmente para profissionais de QA e desenvolvedores, a extensão facilita a captura de dados precisos do navegador para documentação de testes, relatórios de bugs e análise de compatibilidade.

## ✨ Recursos

- **Interface Moderna e Intuitiva**: Design com cards, animações suaves e organização visual aprimorada
- **Sistema de Abas**: Navegação fácil entre informações básicas e avançadas
- **Notificações Elegantes**: Feedback visual com animações de entrada/saída e desaparecimento automático
- **Cópia em Formato Markdown**: Exportação das informações em formato Markdown para fácil integração com ferramentas de documentação
- **Detecção Precisa de Navegadores**: Identificação correta de navegadores modernos, incluindo o Microsoft Edge baseado em Chromium
- **Informações Detalhadas de Versão**: Exibição da versão completa do navegador (ex: 137.0.3296.83)

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
├── icones/                # Ícones da extensão
│   ├── BrowserInfo16.png  # Ícone 16x16
│   └── BrowserInfo48.png  # Ícone 48x48
├── manifest.json          # Configuração da extensão
├── popup.html             # Interface do usuário
├── popup.js               # Lógica principal
├── popup_new.js           # Versão alternativa da lógica (desenvolvimento)
├── styles.css             # Estilos da interface
└── README.md              # Documentação
```

## 🛠️ Tecnologias

- **HTML5**: Estrutura da interface
- **CSS3**: Estilização com animações e efeitos visuais
- **JavaScript**: Lógica de detecção e manipulação de dados
- **Chrome Extension API**: Acesso às informações do navegador
- **Web APIs**: Navigator, Screen, Connection, WebGL

## 🚀 Roadmap

- [ ] Suporte para temas claro/escuro
- [ ] Exportação em formatos adicionais (JSON, HTML)
- [ ] Captura de screenshot da página atual
- [ ] Histórico de informações coletadas
- [ ] Suporte para Firefox via WebExtensions API
- [ ] Publicação na Chrome Web Store e Firefox Add-ons

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
