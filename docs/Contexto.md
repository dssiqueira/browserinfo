# BrowserInfo - Documentação Técnica

## Visão Geral

BrowserInfo é uma extensão para navegadores baseados em Chromium (Chrome, Edge, Opera) que coleta e exibe informações detalhadas sobre o ambiente de navegação. Esta documentação técnica fornece uma visão abrangente da arquitetura, funcionalidades e implementação do projeto.

## Propósito

A extensão foi desenvolvida para atender às necessidades de profissionais de QA e desenvolvedores que precisam:

1. Coletar informações precisas do navegador para documentação de testes
2. Gerar evidências para relatórios de bugs
3. Analisar compatibilidade entre diferentes ambientes
4. Documentar o ambiente exato em que um problema ocorre

## Estrutura da Documentação

Esta documentação está organizada nos seguintes contextos, cada um detalhado em seu próprio arquivo:

1. [**Arquitetura**](./Arquitetura.md) - Visão geral da estrutura do projeto, fluxo de dados e principais componentes
2. [**Interface do Usuário**](./Interface.md) - Detalhes sobre o design, layout e experiência do usuário
3. [**Funcionalidades**](./Funcionalidades.md) - Descrição detalhada de todas as funcionalidades da extensão
4. [**Detecção de Navegador**](./DeteccaoNavegador.md) - Explicação sobre os métodos de detecção de navegador e versão
5. [**Informações Avançadas**](./InformacoesAvancadas.md) - Detalhes sobre a coleta de informações avançadas
6. [**Notificações**](./Notificacoes.md) - Implementação do sistema de notificações
7. [**Exportação de Dados**](./ExportacaoDados.md) - Como funciona a exportação de dados em formato Markdown
8. [**Contexto do Projeto**](./Contexto.md) - Visão geral do projeto, propósito e estrutura da documentação

## Histórico de Desenvolvimento

O BrowserInfo passou por várias iterações e melhorias, incluindo:

- Implementação de uma interface moderna com cards e animações
- Substituição de alertas por notificações elegantes
- Adição de suporte para cópia em múltiplos formatos (posteriormente simplificado para Markdown)
- Implementação de uma aba "Avançado" para informações detalhadas
- Melhoria na detecção de navegadores, especialmente para o Microsoft Edge
- Refinamento da detecção de versão completa do navegador
- Remoção de funções de debug para otimização do código

## Tecnologias Utilizadas

- **HTML5**: Estrutura da interface
- **CSS3**: Estilização com animações e efeitos visuais
- **JavaScript**: Lógica de detecção e manipulação de dados
- **Chrome Extension API**: Acesso às informações do navegador
- **Web APIs**: Navigator, Screen, Connection, WebGL

## Como Usar Esta Documentação

Cada arquivo de contexto pode ser lido independentemente, mas recomendamos começar com este documento para obter uma visão geral antes de explorar os detalhes específicos em cada contexto.

Para desenvolvedores que desejam contribuir ou modificar o projeto, recomendamos ler primeiro a documentação de Arquitetura e depois explorar os contextos específicos relevantes para suas necessidades.

---

Última atualização: Julho de 2025
