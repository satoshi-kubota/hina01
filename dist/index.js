import { Game } from './Game.js';
// ゲーム初期化
window.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new Game('gameCanvas');
        console.log('横スクロールアクションゲームが初期化されました');
        // デバッグ用にグローバルに公開
        window.game = game;
        // =====================================
        // キャラクター画像を変更する方法:
        // =====================================
        // 1. assets/ フォルダに画像を配置
        // 2. 以下のコードのコメントを外して画像パスを指定
        //
        // game.setPlayerImage('assets/player-right.png', 'assets/player-left.png')
        //     .then(() => console.log('プレイヤー画像を読み込みました'))
        //     .catch(() => console.log('画像の読み込みに失敗、デフォルト表示を使用'));
        //
        // ※ 右向き画像だけ指定すると、左向きは自動で反転されます
        game.setPlayerImage('assets/player.png');
        //
        // ※ デフォルトに戻す場合:
        // game.clearPlayerImage();
        // =====================================
        // =====================================
        // 敵キャラクター画像を変更する方法:
        // =====================================
        // game.setEnemyImage('slime', 'assets/slime.png');  // スライム
        // game.setEnemyImage('spike', 'assets/spike.png');  // スパイク
        // game.setEnemyImage('bird', 'assets/bird.png');    // 鳥
        //
        // ※ 左右別の画像を指定する場合:
        // game.setEnemyImage('slime', 'assets/slime-right.png', 'assets/slime-left.png');
        //
        // ※ デフォルトに戻す場合:
        // game.clearEnemyImage('slime');  // 特定の敵
        // game.clearAllEnemyImages();     // 全敵
        // =====================================
    }
    catch (error) {
        console.error('ゲームの初期化に失敗しました:', error);
    }
});
//# sourceMappingURL=index.js.map