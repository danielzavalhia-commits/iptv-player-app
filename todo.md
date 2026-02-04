# IPTV Player - TODO

## Autenticação e Configuração
- [x] Sistema de login com credenciais pré-definidas
- [x] Tela de configuração IPTV (modo servidor e modo M3U)
- [x] Validação e salvamento de configurações IPTV
- [x] Armazenamento de sessão com AsyncStorage

## Parser e Gerenciamento de Conteúdo
- [x] Parser de playlist M3U
- [x] Extração e organização de categorias (filmes, séries, canais ao vivo)
- [x] Estrutura de dados para conteúdo IPTV
- [x] Cache de playlist processada

## Interface de Navegação
- [x] Tab bar com 4 abas (Home, Categorias, Favoritos, Configurações)
- [x] Tela Home com carrosséis de conteúdo
- [x] Tela de Categorias com grid e busca
- [x] Tela de Detalhes de conteúdo
- [x] Tela de Favoritos
- [x] Tela de Configurações

## Player de Vídeo
- [x] Integração com expo-video
- [x] Controles de reprodução (play, pause, seek)
- [x] Suporte a fullscreen
- [x] Suporte a Picture-in-Picture
- [x] Barra de progresso e tempo
- [x] Salvamento de progresso de visualização

## Funcionalidades Adicionais
- [x] Sistema de favoritos
- [x] Histórico de visualização (continuar assistindo)
- [x] Busca de conteúdo
- [ ] Modo escuro/claro (toggle funcional)
- [x] Geração de logo personalizado
- [x] Configuração de branding do app

## Tela de Detalhes (Nova Funcionalidade)
- [x] Estender tipos de dados com campos de sinopse, elenco e avaliações
- [x] Criar tela de detalhes para filmes e séries
- [x] Integrar navegação para tela de detalhes
- [x] Adicionar funcionalidade de favoritos na tela de detalhes
- [x] Testar tela de detalhes com dados de exemplo

## Seletor de Qualidade de Vídeo (Nova Funcionalidade)
- [x] Criar contexto para gerenciar preferência de qualidade
- [x] Adicionar menu de qualidade no player
- [x] Implementar lógica de seleção de qualidade
- [x] Salvar preferência de qualidade no AsyncStorage
- [x] Testar seletor de qualidade

## Integração com Painel de Cliente (Nova Funcionalidade)
- [x] Modificar tela de login para 3 modos (Servidor, M3U, HLS)
- [x] Implementar validação de credenciais com painel
- [x] Testar com dados reais do painel
- [x] Melhorar UX da tela de login
