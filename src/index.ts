import { Game } from './Game.js';

// ゲーム初期化
window.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new Game('gameCanvas');
        console.log('横スクロールアクションゲームが初期化されました');

        // デバッグ用にグローバルに公開
        (window as unknown as { game: Game }).game = game;
    } catch (error) {
        console.error('ゲームの初期化に失敗しました:', error);
    }
});
