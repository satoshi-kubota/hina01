import { Player } from './Player.js';
import { Stage } from './Stage.js';
import { Enemy } from './Enemy.js';
import { DEFAULT_CONFIG } from './types.js';
export class Game {
    constructor(canvasId) {
        this.cameraX = 0;
        this.lastTime = 0;
        this.animationId = 0;
        this.isTouchDevice = false;
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error('Canvas not found');
        }
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context');
        }
        this.ctx = ctx;
        this.config = { ...DEFAULT_CONFIG };
        this.canvas.width = this.config.canvasWidth;
        this.canvas.height = this.config.canvasHeight;
        this.player = new Player(100, 400, this.config);
        this.stage = new Stage(this.config);
        this.input = {
            left: false,
            right: false,
            jump: false
        };
        this.state = {
            score: 0,
            lives: 3,
            isRunning: false,
            isGameOver: false
        };
        // UI要素の取得
        this.scoreElement = document.getElementById('score-value');
        this.livesElement = document.getElementById('lives-value');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        this.touchControls = document.getElementById('touch-controls');
        // タッチデバイス検出
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.setupEventListeners();
    }
    setupEventListeners() {
        // キーボード入力
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        // スタートボタン
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }
        // リスタートボタン
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }
        // タッチコントロール
        this.setupTouchControls();
    }
    setupTouchControls() {
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');
        // 左ボタン
        if (btnLeft) {
            btnLeft.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.input.left = true;
            });
            btnLeft.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.input.left = false;
            });
            btnLeft.addEventListener('touchcancel', () => {
                this.input.left = false;
            });
        }
        // 右ボタン
        if (btnRight) {
            btnRight.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.input.right = true;
            });
            btnRight.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.input.right = false;
            });
            btnRight.addEventListener('touchcancel', () => {
                this.input.right = false;
            });
        }
        // ジャンプボタン
        if (btnJump) {
            btnJump.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.input.jump = true;
            });
            btnJump.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.input.jump = false;
            });
            btnJump.addEventListener('touchcancel', () => {
                this.input.jump = false;
            });
        }
    }
    showTouchControls() {
        if (this.touchControls && this.isTouchDevice) {
            this.touchControls.classList.remove('hidden');
        }
    }
    hideTouchControls() {
        if (this.touchControls) {
            this.touchControls.classList.add('hidden');
        }
    }
    handleKeyDown(e) {
        switch (e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.input.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.input.right = true;
                break;
            case 'Space':
            case 'ArrowUp':
            case 'KeyW':
                this.input.jump = true;
                e.preventDefault();
                break;
        }
    }
    handleKeyUp(e) {
        switch (e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.input.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.input.right = false;
                break;
            case 'Space':
            case 'ArrowUp':
            case 'KeyW':
                this.input.jump = false;
                break;
        }
    }
    start() {
        if (this.startScreen) {
            this.startScreen.classList.add('hidden');
        }
        this.showTouchControls();
        this.state.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
    restart() {
        // 状態リセット
        this.state = {
            score: 0,
            lives: 3,
            isRunning: true,
            isGameOver: false
        };
        this.cameraX = 0;
        this.player.reset(100, 400);
        this.stage.reset();
        this.updateUI();
        if (this.gameOverScreen) {
            this.gameOverScreen.classList.add('hidden');
            // ゲームクリア後のリスタート用にタイトルを戻す
            const title = this.gameOverScreen.querySelector('h1');
            if (title) {
                title.textContent = 'ゲームオーバー';
            }
        }
        this.showTouchControls();
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
    gameLoop(currentTime) {
        if (!this.state.isRunning)
            return;
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.update(deltaTime);
        this.draw();
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    update(deltaTime) {
        // プレイヤー入力処理
        this.player.handleInput(this.input);
        // プレイヤー更新
        this.player.update(deltaTime);
        // ステージ更新
        this.stage.update(deltaTime);
        // 衝突判定
        this.handleCollisions();
        // カメラ更新（プレイヤーを追従）
        this.updateCamera();
        // ゴール判定
        if (this.player.x >= this.stage.getGoalX()) {
            this.win();
        }
        // 落下判定
        if (this.player.y > this.config.canvasHeight + 50) {
            this.loseLife();
        }
        // UI更新
        this.updateUI();
    }
    handleCollisions() {
        // プラットフォームとの衝突
        let onGround = false;
        for (const platform of this.stage.platforms) {
            if (this.player.intersects(platform)) {
                // 上から着地
                if (this.player.velocity.y > 0 &&
                    this.player.y + this.player.height - this.player.velocity.y <= platform.y + 5) {
                    this.player.y = platform.y - this.player.height;
                    this.player.velocity.y = 0;
                    onGround = true;
                }
                // 下から当たる
                else if (this.player.velocity.y < 0 &&
                    this.player.y - this.player.velocity.y >= platform.y + platform.height - 5) {
                    this.player.y = platform.y + platform.height;
                    this.player.velocity.y = 0;
                }
                // 横から当たる
                else {
                    if (this.player.velocity.x > 0) {
                        this.player.x = platform.x - this.player.width;
                    }
                    else if (this.player.velocity.x < 0) {
                        this.player.x = platform.x + platform.width;
                    }
                    this.player.velocity.x = 0;
                }
            }
        }
        this.player.setGrounded(onGround);
        // 敵との衝突
        for (const enemy of this.stage.enemies) {
            if (!enemy.getIsAlive())
                continue;
            if (this.player.intersects(enemy)) {
                // 上から踏む判定
                const playerBottom = this.player.y + this.player.height;
                const enemyTop = enemy.y;
                const wasAbove = playerBottom - this.player.velocity.y <= enemyTop + 10;
                if (this.player.velocity.y > 0 && wasAbove && enemy.canBeStopped()) {
                    // 敵を踏んで倒す
                    const points = enemy.stomp();
                    this.state.score += points;
                    this.player.bounce();
                }
                else {
                    // 敵にダメージを受ける
                    if (this.player.hit()) {
                        this.loseLife();
                    }
                }
            }
        }
        // 画面左端の制限
        if (this.player.x < this.cameraX) {
            this.player.x = this.cameraX;
            this.player.velocity.x = 0;
        }
    }
    updateCamera() {
        // プレイヤーを画面の左1/3あたりに保つ
        const targetX = this.player.x - this.config.canvasWidth / 3;
        this.cameraX = Math.max(0, Math.min(targetX, this.stage.getStageWidth() - this.config.canvasWidth));
    }
    loseLife() {
        this.state.lives--;
        if (this.state.lives <= 0) {
            this.gameOver();
        }
        else {
            // プレイヤーをリスポーン
            this.player.reset(Math.max(100, this.cameraX + 100), 400);
        }
    }
    gameOver() {
        this.state.isRunning = false;
        this.state.isGameOver = true;
        cancelAnimationFrame(this.animationId);
        this.hideTouchControls();
        if (this.finalScoreElement) {
            this.finalScoreElement.textContent = this.state.score.toString();
        }
        if (this.gameOverScreen) {
            this.gameOverScreen.classList.remove('hidden');
        }
    }
    win() {
        this.state.score += 1000; // クリアボーナス
        this.state.isRunning = false;
        cancelAnimationFrame(this.animationId);
        this.hideTouchControls();
        if (this.finalScoreElement) {
            this.finalScoreElement.textContent = this.state.score.toString();
        }
        if (this.gameOverScreen) {
            const title = this.gameOverScreen.querySelector('h1');
            if (title) {
                title.textContent = 'ゲームクリア！';
            }
            this.gameOverScreen.classList.remove('hidden');
        }
    }
    updateUI() {
        if (this.scoreElement) {
            this.scoreElement.textContent = this.state.score.toString();
        }
        if (this.livesElement) {
            this.livesElement.textContent = this.state.lives.toString();
        }
    }
    draw() {
        // 背景クリア（グラデーション）
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.config.canvasHeight);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
        // ステージ描画
        this.stage.draw(this.ctx, this.cameraX);
        // プレイヤー描画
        this.player.draw(this.ctx, this.cameraX);
    }
    // プレイヤーの画像を設定
    setPlayerImage(rightImagePath, leftImagePath) {
        return this.player.setImages(rightImagePath, leftImagePath);
    }
    // プレイヤーの画像をクリア（デフォルトに戻す）
    clearPlayerImage() {
        this.player.clearImages();
    }
    // 敵の画像を設定
    setEnemyImage(type, rightImagePath, leftImagePath) {
        return Enemy.setImage(type, rightImagePath, leftImagePath);
    }
    // 敵の画像をクリア
    clearEnemyImage(type) {
        Enemy.clearImage(type);
    }
    // 全敵の画像をクリア
    clearAllEnemyImages() {
        Enemy.clearAllImages();
    }
}
//# sourceMappingURL=Game.js.map