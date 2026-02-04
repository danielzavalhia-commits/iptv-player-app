# Design de Interface - IPTV Player

## Visão Geral
Aplicativo móvel para reprodução de conteúdo IPTV (filmes, séries e canais ao vivo) com interface moderna e intuitiva, seguindo as diretrizes do Apple Human Interface Guidelines para orientação retrato (9:16) e uso com uma mão.

## Paleta de Cores
- **Primary (Accent)**: `#E63946` (vermelho vibrante) - botões principais, elementos interativos
- **Background**: `#FFFFFF` (light) / `#0A0E14` (dark) - fundo principal
- **Surface**: `#F8F9FA` (light) / `#1A1F2E` (dark) - cards e superfícies elevadas
- **Foreground**: `#1D3557` (light) / `#E8EAF0` (dark) - texto principal
- **Muted**: `#6C757D` (light) / `#8B92A8` (dark) - texto secundário
- **Border**: `#DEE2E6` (light) / `#2A3142` (dark) - bordas e divisores

## Lista de Telas

### 1. Tela de Login (Login Screen)
**Conteúdo:**
- Logo do aplicativo centralizado
- Campo de entrada: usuário/email
- Campo de entrada: senha
- Botão "Entrar" (primary)
- Link "Esqueci minha senha" (opcional, desabilitado inicialmente)

**Funcionalidade:**
- Validação de credenciais pré-definidas
- Feedback visual de erro/sucesso
- Armazenamento de sessão com AsyncStorage

### 2. Tela de Configuração IPTV (IPTV Setup Screen)
**Conteúdo:**
- Título: "Configurar IPTV"
- Segmented control: "Servidor" / "Playlist M3U"
- **Modo Servidor:**
  - Campo: URL do servidor
  - Campo: Usuário
  - Campo: Senha
- **Modo Playlist M3U:**
  - Campo: URL da playlist M3U
  - Botão: "Importar arquivo M3U" (opcional)
- Botão "Salvar e Continuar" (primary)
- Indicador de carregamento durante parsing

**Funcionalidade:**
- Alternar entre dois modos de configuração
- Validar e salvar configurações
- Fazer parsing da playlist M3U
- Extrair categorias (filmes, séries, canais ao vivo)

### 3. Tela Principal - Home (Home Screen)
**Conteúdo:**
- Header:
  - Logo pequeno (esquerda)
  - Título "IPTV Player"
  - Ícone de configurações (direita)
- Seção "Continuar Assistindo" (carrossel horizontal)
- Seção "Filmes" (carrossel horizontal com thumbnails)
- Seção "Séries" (carrossel horizontal com thumbnails)
- Seção "Canais ao Vivo" (carrossel horizontal com logos)

**Funcionalidade:**
- Navegação rápida entre categorias
- Scroll vertical para explorar conteúdo
- Tap em item abre tela de detalhes

### 4. Tela de Categoria (Category Screen)
**Conteúdo:**
- Header com título da categoria e botão voltar
- Barra de busca
- Grid de itens (2 colunas para filmes/séries, lista para canais)
- Thumbnail + título + informações básicas

**Funcionalidade:**
- Listar todos os itens da categoria
- Busca em tempo real
- Filtros (gênero, ano, etc.)
- Tap em item abre tela de detalhes ou player

### 5. Tela de Detalhes (Detail Screen)
**Conteúdo:**
- Thumbnail/poster grande (topo)
- Título e ano
- Descrição/sinopse
- Informações: duração, gênero, classificação
- Botão "Assistir" (primary, destaque)
- Botão "Adicionar aos Favoritos" (secundário)
- Para séries: lista de temporadas e episódios

**Funcionalidade:**
- Exibir informações completas
- Iniciar reprodução
- Gerenciar favoritos

### 6. Tela de Player (Player Screen)
**Conteúdo:**
- Vídeo em tela cheia (landscape preferencial)
- Controles overlay:
  - Botão voltar (canto superior esquerdo)
  - Título do conteúdo (topo)
  - Play/Pause (centro)
  - Barra de progresso
  - Tempo atual / tempo total
  - Botão fullscreen
  - Botão de configurações (qualidade, legendas)

**Funcionalidade:**
- Reprodução de vídeo via expo-video
- Controles touch: tap para mostrar/ocultar controles
- Suporte a Picture-in-Picture
- Suporte a fullscreen
- Salvar progresso de visualização

### 7. Tela de Favoritos (Favorites Screen)
**Conteúdo:**
- Header: "Meus Favoritos"
- Lista/grid de itens favoritados
- Estado vazio: "Nenhum favorito ainda"

**Funcionalidade:**
- Listar conteúdo marcado como favorito
- Remover dos favoritos
- Acesso rápido ao player

### 8. Tela de Configurações (Settings Screen)
**Conteúdo:**
- Seção "Conta":
  - Nome do usuário
  - Botão "Sair"
- Seção "IPTV":
  - Configurações atuais
  - Botão "Reconfigurar IPTV"
- Seção "Aparência":
  - Toggle: Modo escuro
- Seção "Sobre":
  - Versão do app
  - Termos de uso

**Funcionalidade:**
- Gerenciar configurações do usuário
- Logout
- Alterar configurações de IPTV
- Toggle de tema claro/escuro

## Fluxos Principais de Usuário

### Fluxo 1: Primeiro Acesso
1. Usuário abre o app → **Tela de Login**
2. Insere credenciais pré-definidas → Tap "Entrar"
3. Redirecionado para → **Tela de Configuração IPTV**
4. Escolhe modo (Servidor ou M3U) → Preenche dados → Tap "Salvar e Continuar"
5. App faz parsing da playlist → Redirecionado para → **Tela Principal (Home)**

### Fluxo 2: Assistir Filme
1. Usuário na **Tela Principal (Home)**
2. Navega pelo carrossel "Filmes" → Tap em um filme
3. Abre **Tela de Detalhes** → Visualiza informações
4. Tap "Assistir" → Abre **Tela de Player**
5. Assiste ao conteúdo → Tap voltar → Retorna à **Tela de Detalhes** ou **Home**

### Fluxo 3: Assistir Canal ao Vivo
1. Usuário na **Tela Principal (Home)**
2. Navega pelo carrossel "Canais ao Vivo" → Tap em um canal
3. Abre diretamente **Tela de Player** (sem tela de detalhes)
4. Assiste ao canal → Tap voltar → Retorna à **Home**

### Fluxo 4: Buscar Conteúdo
1. Usuário na **Tela Principal (Home)**
2. Tap em uma categoria (ex: "Ver todos" em Séries) → Abre **Tela de Categoria**
3. Usa barra de busca → Digita nome da série
4. Resultados filtrados em tempo real → Tap em item
5. Abre **Tela de Detalhes** → Tap "Assistir" → **Tela de Player**

### Fluxo 5: Gerenciar Favoritos
1. Usuário na **Tela de Detalhes** de um conteúdo
2. Tap "Adicionar aos Favoritos" → Ícone muda para "favoritado"
3. Usuário navega para **Tab de Favoritos** na navegação inferior
4. Visualiza lista de favoritos → Tap em item → Abre **Tela de Detalhes**

### Fluxo 6: Reconfigurar IPTV
1. Usuário na **Tela Principal (Home)**
2. Tap no ícone de configurações (header) → Abre **Tela de Configurações**
3. Tap "Reconfigurar IPTV" → Abre **Tela de Configuração IPTV**
4. Altera dados → Tap "Salvar e Continuar"
5. App recarrega playlist → Retorna à **Home** com novo conteúdo

## Navegação

### Estrutura de Tabs (Bottom Tab Bar)
- **Home** (ícone: house.fill)
- **Categorias** (ícone: square.grid.2x2.fill)
- **Favoritos** (ícone: heart.fill)
- **Configurações** (ícone: gearshape.fill)

### Navegação Stack
- Login → Configuração IPTV → Home (stack inicial)
- Home → Detalhes → Player
- Categoria → Detalhes → Player
- Favoritos → Detalhes → Player

## Considerações de Design

### Orientação e Uso com Uma Mão
- Interface otimizada para orientação **retrato (9:16)**
- Elementos interativos principais na metade inferior da tela
- Tab bar fixo na parte inferior para acesso rápido
- Player suporta rotação para **landscape** durante reprodução

### Feedback Visual
- Animações suaves (fade, scale) em transições
- Estados de press com opacity 0.7 em cards
- Indicadores de carregamento durante parsing e buffering
- Haptic feedback em ações principais (tap em botões)

### Acessibilidade
- Contraste adequado entre texto e fundo
- Tamanhos de fonte legíveis (mínimo 14px para corpo)
- Áreas de toque mínimas de 44x44pt
- Suporte a modo escuro

### Performance
- Lazy loading de thumbnails
- Cache de imagens com expo-image
- Paginação em listas longas
- Otimização de parsing de playlist M3U
