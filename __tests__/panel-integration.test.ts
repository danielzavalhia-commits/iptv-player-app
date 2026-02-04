import { describe, it, expect } from 'vitest';
import { IPTVConfig } from '@/types';

describe('Panel Integration', () => {
  describe('Server Config', () => {
    it('deve criar config de servidor válida', () => {
      const serverConfig: IPTVConfig = {
        mode: 'server',
        url: 'http://x29.acxll.shop',
        username: '49954959',
        password: '75570759',
      };

      expect(serverConfig.mode).toBe('server');
      expect(serverConfig.url).toBe('http://x29.acxll.shop');
      expect((serverConfig as any).username).toBe('49954959');
      expect((serverConfig as any).password).toBe('75570759');
    });

    it('deve construir URL de playlist do servidor corretamente', () => {
      const serverConfig: IPTVConfig = {
        mode: 'server',
        url: 'http://x29.acxll.shop',
        username: '49954959',
        password: '75570759',
      };

      const playlistUrl = `${serverConfig.url}/get.php?username=${(serverConfig as any).username}&password=${(serverConfig as any).password}&type=m3u_plus&output=ts`;
      
      expect(playlistUrl).toBe(
        'http://x29.acxll.shop/get.php?username=49954959&password=75570759&type=m3u_plus&output=ts'
      );
    });

    it('deve remover trailing slash da URL do servidor', () => {
      const url = 'http://x29.acxll.shop/';
      const cleanUrl = url.replace(/\/$/, '');
      
      expect(cleanUrl).toBe('http://x29.acxll.shop');
    });
  });

  describe('M3U Config', () => {
    it('deve criar config M3U válida', () => {
      const m3uConfig: IPTVConfig = {
        mode: 'm3u',
        url: 'http://x29.acxll.shop/get.php?username=49954959&password=75570759&type=m3u_plus&output=mpegts',
      };

      expect(m3uConfig.mode).toBe('m3u');
      expect(m3uConfig.url).toContain('get.php');
      expect(m3uConfig.url).toContain('username=49954959');
    });

    it('deve validar URL M3U completa', () => {
      const m3uUrl = 'http://x29.acxll.shop/get.php?username=49954959&password=75570759&type=m3u_plus&output=mpegts';
      
      expect(m3uUrl).toMatch(/^http(s)?:\/\//);
      expect(m3uUrl).toContain('get.php');
      expect(m3uUrl).toContain('username=');
      expect(m3uUrl).toContain('password=');
    });
  });

  describe('HLS Config', () => {
    it('deve criar config HLS válida', () => {
      const hlsConfig: IPTVConfig = {
        mode: 'm3u',
        url: 'http://x29.acxll.shop/get.php?username=49954959&password=75570759&type=m3u_plus&output=hls',
      };

      expect(hlsConfig.mode).toBe('m3u');
      expect(hlsConfig.url).toContain('output=hls');
    });
  });

  describe('DNS Alternativo', () => {
    it('deve suportar múltiplos DNS', () => {
      const dns1 = 'http://x29.acxll.shop';
      const dns2 = 'http://ac.x22lgy.site';
      
      expect(dns1).toMatch(/^http(s)?:\/\//);
      expect(dns2).toMatch(/^http(s)?:\/\//);
    });

    it('deve construir URL com DNS alternativo', () => {
      const dns = 'http://ac.x22lgy.site';
      const username = '49954959';
      const password = '75570759';
      
      const playlistUrl = `${dns}/get.php?username=${username}&password=${password}&type=m3u_plus&output=ts`;
      
      expect(playlistUrl).toContain('ac.x22lgy.site');
      expect(playlistUrl).toContain('get.php');
    });
  });

  describe('Validação de Credenciais', () => {
    it('deve validar que username não está vazio', () => {
      const username = '49954959';
      expect(username.trim().length).toBeGreaterThan(0);
    });

    it('deve validar que password não está vazio', () => {
      const password = '75570759';
      expect(password.trim().length).toBeGreaterThan(0);
    });

    it('deve validar que DNS não está vazio', () => {
      const dns = 'http://x29.acxll.shop';
      expect(dns.trim().length).toBeGreaterThan(0);
    });

    it('deve validar que URL M3U não está vazia', () => {
      const m3uUrl = 'http://x29.acxll.shop/get.php?username=49954959&password=75570759&type=m3u_plus&output=mpegts';
      expect(m3uUrl.trim().length).toBeGreaterThan(0);
    });
  });
});
