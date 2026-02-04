import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import { useKeepAwake } from 'expo-keep-awake';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useWatchHistory } from '@/lib/watch-history-context';
import { useQuality, getQualityUrl } from '@/lib/quality-context';
import { QualityMenu } from '@/components/quality-menu';
import * as Haptics from 'expo-haptics';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function PlayerScreen() {
  useKeepAwake(); // Manter tela ligada durante reprodução
  
  const params = useLocalSearchParams<{ url: string; title: string; id: string; type: string }>();
  const router = useRouter();
  const colors = useColors();
  const { saveProgress } = useWatchHistory();
  
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  
  const { quality } = useQuality();
  
  // Construir URL com qualidade selecionada
  const qualityUrl = getQualityUrl(params.url, quality);

  const player = useVideoPlayer(qualityUrl, (player) => {
    player.play();
  });

  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  // Rotação da tela para landscape ao entrar
  useEffect(() => {
    if (Platform.OS !== 'web') {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    
    return () => {
      if (Platform.OS !== 'web') {
        ScreenOrientation.unlockAsync();
      }
    };
  }, []);

  // Salvar progresso periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      if (player.currentTime > 0 && player.duration > 0) {
        saveProgress(
          params.id,
          params.type as any,
          player.currentTime,
          player.duration,
          params.title
        );
      }
    }, 10000); // Salvar a cada 10 segundos

    return () => clearInterval(interval);
  }, [player.currentTime, player.duration]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showControls, isPlaying]);

  const handlePlayPause = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleQualityPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowQualityMenu(true);
  };

  return (
    <View style={styles.container}>
      {/* Player de Vídeo */}
      <TouchableOpacity 
        style={styles.videoContainer} 
        activeOpacity={1}
        onPress={toggleControls}
      >
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
        />

        {/* Loading */}
        {status === 'loading' && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.foreground }]}>
              Carregando...
            </Text>
          </View>
        )}

            {/* Controles */}
            {showControls && (
              <View style={styles.controlsOverlay}>
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backButton}
                    activeOpacity={0.7}
                  >
                    <IconSymbol name="arrow.left" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.title} numberOfLines={1}>
                    {params.title}
                  </Text>
                  {/* Botão de Qualidade */}
                  <TouchableOpacity
                    onPress={handleQualityPress}
                    style={styles.qualityButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.qualityButtonText}>{quality.toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>

            {/* Play/Pause Central */}
            <View style={styles.centerControls}>
              <TouchableOpacity
                onPress={handlePlayPause}
                style={styles.playButton}
                activeOpacity={0.7}
              >
                <IconSymbol 
                  name={isPlaying ? "pause.fill" : "play.fill"} 
                  size={48} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>

            {/* Footer com progresso */}
            <View style={styles.footer}>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: player.duration > 0
                          ? `${(player.currentTime / player.duration) * 100}%`
                          : '0%',
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {formatTime(player.currentTime)}
                  </Text>
                  <Text style={styles.timeText}>
                    {formatTime(player.duration)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Menu de Qualidade */}
      <QualityMenu visible={showQualityMenu} onClose={() => setShowQualityMenu(false)} />
    </View>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  title: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  qualityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  qualityButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 40,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
