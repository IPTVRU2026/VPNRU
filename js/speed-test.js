// Speed Test
class SpeedTest {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('speedHistory')) || [];
        this.updateHistoryDisplay();
    }

    async testSpeed() {
        const btn = document.querySelector('.speed-btn');
        const display = document.getElementById('speedValue');
        const progressBar = document.querySelector('.speed-progress-bar');
        
        btn.disabled = true;
        btn.textContent = '⏳ Измерение...';
        progressBar.style.width = '0%';
        
        const startTime = Date.now();
        let downloaded = 0;
        const targetSize = 5 * 1024 * 1024; // 5MB
        
        try {
            const chunk = new Uint8Array(1024 * 1024);
            for (let i = 0; i < 5; i++) {
                const blob = new Blob([chunk]);
                downloaded += blob.size;
                
                const elapsed = (Date.now() - startTime) / 1000;
                const speedMbps = (downloaded * 8) / (1024 * 1024) / elapsed;
                
                const progress = (i + 1) * 20;
                progressBar.style.width = progress + '%';
                display.textContent = speedMbps.toFixed(2);
                
                await new Promise(r => setTimeout(r, 200));
            }
            
            const totalTime = (Date.now() - startTime) / 1000;
            const finalSpeed = (downloaded * 8) / (1024 * 1024) / totalTime;
            
            display.textContent = finalSpeed.toFixed(2);
            this.saveResult(finalSpeed);
            
        } catch (error) {
            display.textContent = '0';
            alert('Ошибка измерения: ' + error.message);
        }
        
        btn.disabled = false;
        btn.textContent = '🚀 Начать измерение';
    }
    
    saveResult(speed) {
        const result = {
            speed: speed.toFixed(2),
            time: new Date().toLocaleString(),
            status: speed > 0 ? '✅ Работает' : '❌ Не работает',
            type: speed > 50 ? '🚀 Отлично' : speed > 20 ? '👍 Хорошо' : speed > 0 ? '👎 Медленно' : '💀 Не работает'
        };
        
        this.history.unshift(result);
        if (this.history.length > 10) this.history.pop();
        
        localStorage.setItem('speedHistory', JSON.stringify(this.history));
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        const historyDiv = document.querySelector('.speed-history');
        if (!historyDiv) return;
        
        let html = '<h3>📊 История измерений</h3>';
        
        if (this.history.length === 0) {
            html += '<p style="color: var(--text-secondary);">Пока нет измерений</p>';
        } else {
            this.history.forEach(item => {
                const color = item.speed > 0 ? '#00ff9d' : '#ff4757';
                html += `
                    <div class="speed-history-item">
                        <span>${item.time}</span>
                        <span style="color: ${color}">
                            ${item.speed} Мбит/с ${item.type}
                        </span>
                    </div>
                `;
            });
        }
        
        historyDiv.innerHTML = html;
    }
}

function copyConfig(config) {
    navigator.clipboard.writeText(config).then(() => {
        alert('✅ Конфиг скопирован!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.speed-test')) {
        window.speedTest = new SpeedTest();
    }
});
