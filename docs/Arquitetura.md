# Arquitetura do BrowserInfo

## Visão Geral da Arquitetura

O BrowserInfo segue a arquitetura padrão de extensões para navegadores Chromium, com separação clara entre a interface do usuário, lógica de negócios e configuração. A extensão é construída usando um modelo de arquitetura simples e eficiente, adequado para o escopo e requisitos do projeto.

## Componentes Principais

### 1. Configuração da Extensão (manifest.json)

O arquivo `manifest.json` define as configurações básicas da extensão, incluindo:
- Metadados (nome, versão, descrição)
- Permissões necessárias
- Recursos da extensão (ícones, popup)
- Configurações de segurança

Este arquivo é o ponto de entrada para o carregamento da extensão pelo navegador e define como ela interage com o sistema.

### 2. Interface do Usuário (popup.html)

A interface do usuário é implementada como um popup HTML que é exibido quando o usuário clica no ícone da extensão. A interface utiliza:
- HTML5 para estrutura
- CSS3 para estilização
- Sistema de abas para organização do conteúdo
- Cards para agrupamento visual de informações

### 3. Camada de Apresentação (styles.css)

O arquivo `styles.css` contém todas as regras de estilo para a interface do usuário, incluindo:
- Layout responsivo
- Animações e transições
- Esquema de cores e tipografia
- Estilos para componentes específicos (cards, notificações, abas)

### 4. Lógica de Negócios (popup.js)

O arquivo `popup.js` contém toda a lógica da aplicação, organizada em funções específicas para:
- Detecção de informações do navegador
- Manipulação da interface do usuário
- Gerenciamento de eventos
- Exportação de dados

## Fluxo de Dados

O fluxo de dados na extensão segue um padrão simples:

1. **Inicialização**:
   - O evento `DOMContentLoaded` dispara a configuração inicial
   - O sistema de abas é configurado
   - As informações básicas do navegador são coletadas e exibidas

2. **Interação do Usuário**:
   - Mudança entre abas (básico/avançado)
   - Solicitação de cópia de informações
   - Interação com elementos da interface

3. **Coleta de Dados**:
   - Informações básicas são coletadas na inicialização
   - Informações avançadas são coletadas sob demanda (quando a aba avançada é selecionada)
   - APIs do navegador são consultadas para obter dados específicos

4. **Apresentação**:
   - Os dados coletados são formatados e exibidos na interface
   - Notificações fornecem feedback sobre ações do usuário

5. **Exportação**:
   - Os dados coletados são formatados em Markdown
   - O conteúdo formatado é copiado para a área de transferência

## Diagrama de Componentes

```
+-------------------+      +-------------------+
|                   |      |                   |
|   manifest.json   +----->+    popup.html     |
|  (Configuração)   |      |   (Interface)     |
|                   |      |                   |
+-------------------+      +--------+----------+
                                    |
                                    v
                           +--------+----------+
                           |                   |
                           |    styles.css     |
                           |  (Estilização)    |
                           |                   |
                           +--------+----------+
                                    |
                                    v
                           +--------+----------+
                           |                   |
                           |     popup.js      |
                           |     (Lógica)      |
                           |                   |
                           +-------------------+
```

## Padrões de Design

A extensão utiliza os seguintes padrões de design:

1. **Separação de Responsabilidades**:
   - HTML para estrutura
   - CSS para apresentação
   - JavaScript para comportamento

2. **Programação Orientada a Eventos**:
   - Listeners de eventos para interações do usuário
   - Callbacks para operações assíncronas

3. **Funções Especializadas**:
   - Cada função tem uma responsabilidade específica
   - Funções são agrupadas por domínio (UI, detecção, exportação)

4. **Lazy Loading**:
   - Informações avançadas são carregadas apenas quando necessárias

## Considerações Técnicas

### Desempenho

A extensão foi projetada para ser leve e rápida, com:
- Carregamento sob demanda de informações avançadas
- Uso eficiente de APIs do navegador
- Minimização de operações síncronas que poderiam bloquear a UI

### Compatibilidade

A extensão é compatível com navegadores baseados em Chromium (versão 88+), incluindo:
- Google Chrome
- Microsoft Edge
- Opera

### Segurança

A extensão requer permissões mínimas para funcionar:
- `activeTab`: Para acessar informações da aba atual
- `tabs`: Para obter a URL atual

Nenhum dado é enviado para servidores externos, todas as operações são realizadas localmente no navegador do usuário.

---

Próximo: [Interface do Usuário](./Interface.md)
