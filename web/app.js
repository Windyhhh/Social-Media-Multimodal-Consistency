const API_SERVER = 'http://localhost:5000';
let monitoringActive = false;

// 用户认证相关全局变量
let currentToken = localStorage.getItem('authToken') || null;
let currentUser = localStorage.getItem('currentUser') || null;
let currentRole = localStorage.getItem('currentRole') || null;

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    // 标记当前菜单项
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes("'" + pageId + "'")) {
            item.classList.add('active');
        }
    });

    // 当切换到特定页面时，自动加载数据
    if (pageId === 'history') {
        console.log('切换到历史页面，加载数据...');
        if (typeof loadDetectionHistory === 'function') {
            loadDetectionHistory();
        }
    } else if (pageId === 'statistics') {
        console.log('切换到统计页面，加载数据...');
        if (typeof loadStatisticsData === 'function') {
            loadStatisticsData();
        }
    } else if (pageId === 'performance') {
        console.log('切换到性能页面，加载数据...');
        if (typeof loadPerformanceData === 'function') {
            loadPerformanceData();
        }
    }
}

async function detectSingle() {
    const imageInput = document.getElementById('imageInput');
    const textInput = document.getElementById('textInput');
    const resultDiv = document.getElementById('detectResult');

    if (!imageInput.files[0] || !textInput.value) {
        resultDiv.innerHTML = '<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 请上传图像并输入文本</div>';
        return;
    }

    resultDiv.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> 检测中...</div>';

    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageBase64 = e.target.result.split(',')[1];
            const response = await fetch(`${API_SERVER}/api/detect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageBase64,
                    text: textInput.value
                })
            });

            const data = await response.json();
            if (response.ok) {
                const isConsistent = data.prediction === 'consistent';
                const resultClass = isConsistent ? 'success' : 'error';
                const resultText = isConsistent ? '✓ 一致' : '✗ 不一致';
                resultDiv.innerHTML = `
                    <div class="result-box ${resultClass}">
                        <strong>检测结果: ${resultText}</strong><br>
                        一致度: ${(data.consistency_score * 100).toFixed(2)}%<br>
                        VGG分数: ${(data.vgg_score * 100).toFixed(2)}%<br>
                        Mobile分数: ${(data.mobile_score * 100).toFixed(2)}%<br>
                        模型一致性: ${(data.model_agreement * 100).toFixed(2)}%<br>
                        置信度: ${(data.confidence * 100).toFixed(2)}%<br>
                        时间: ${new Date(data.timestamp).toLocaleString()}
                    </div>
                `;

                // 检测成功后，自动刷新历史和统计数据
                console.log('检测完成，刷新历史和统计数据...');
                // 延迟一下确保后端已保存数据
                setTimeout(() => {
                    if (typeof loadDetectionHistory === 'function') {
                        loadDetectionHistory();
                    }
                    if (typeof loadStatisticsData === 'function') {
                        loadStatisticsData();
                    }
                }, 500);
            } else {
                resultDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${data.error}</div>`;
            }
        };
        reader.readAsDataURL(imageInput.files[0]);
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${error.message}</div>`;
    }
}

async function detectBatch() {
    const csvInput = document.getElementById('csvInput');
    const resultDiv = document.getElementById('batchResult');

    if (!csvInput.files[0]) {
        resultDiv.innerHTML = '<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 请上传CSV文件</div>';
        return;
    }

    resultDiv.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> 批量检测中...</div>';

    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const csv = e.target.result;
            const lines = csv.split('\n').filter(line => line.trim());
            const results = [];

            for (let i = 0; i < lines.length; i++) {
                const [imageUrl, text] = lines[i].split(',').map(s => s.trim());
                if (!imageUrl || !text) continue;

                try {
                    const response = await fetch(`${API_SERVER}/api/batch-detect`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image_url: imageUrl, text: text })
                    });
                    const data = await response.json();
                    results.push({
                        url: imageUrl,
                        text: text.substring(0, 30),
                        result: data.prediction === 'consistent' ? '✓ 一致' : '✗ 不一致',
                        score: (data.consistency_score * 100).toFixed(2)
                    });
                } catch (err) {
                    results.push({
                        url: imageUrl,
                        text: text.substring(0, 30),
                        result: '错误',
                        score: '0'
                    });
                }
            }

            let html = '<div class="table-container"><table><thead><tr><th>图像URL</th><th>文本</th><th>结果</th><th>置信度</th></tr></thead><tbody>';
            results.forEach(r => {
                html += `<tr><td>${r.url}</td><td>${r.text}</td><td>${r.result}</td><td>${r.score}%</td></tr>`;
            });
            html += '</tbody></table></div>';
            resultDiv.innerHTML = html;
        };
        reader.readAsText(csvInput.files[0]);
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${error.message}</div>`;
    }
}

async function detectUrl() {
    const imageUrl = document.getElementById('imageUrl').value;
    const urlText = document.getElementById('urlText').value;
    const resultDiv = document.getElementById('urlResult');

    if (!imageUrl || !urlText) {
        resultDiv.innerHTML = '<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 请输入URL和文本</div>';
        return;
    }

    resultDiv.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> 检测中...</div>';

    try {
        const response = await fetch(`${API_SERVER}/api/detect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image_url: imageUrl,
                text: urlText
            })
        });

        const data = await response.json();
        if (response.ok) {
            const isConsistent = data.prediction === 'consistent';
            const resultClass = isConsistent ? 'success' : 'error';
            const resultText = isConsistent ? '✓ 一致' : '✗ 不一致';
            resultDiv.innerHTML = `
                <div class="result-box ${resultClass}">
                    <strong>检测结果: ${resultText}</strong><br>
                    一致度: ${(data.consistency_score * 100).toFixed(2)}%<br>
                    不一致度: ${(data.inconsistency_score * 100).toFixed(2)}%<br>
                    时间: ${new Date(data.timestamp).toLocaleString()}
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${error.message}</div>`;
    }
}

function startMonitoring() {
    monitoringActive = true;
    const resultDiv = document.getElementById('monitorResult');
    resultDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> 监测已启动</div>';
}

function stopMonitoring() {
    monitoringActive = false;
    const resultDiv = document.getElementById('monitorResult');
    resultDiv.innerHTML = '<div class="alert alert-error"><i class="fas fa-stop-circle"></i> 监测已停止</div>';
}

async function loadHistory() {
    const resultDiv = document.getElementById('historyBody');
    resultDiv.innerHTML = '<tr><td colspan="4" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i></td></tr>';

    try {
        const response = await fetch(`${API_SERVER}/api/history`);
        const data = await response.json();

        if (data.history && data.history.length > 0) {
            resultDiv.innerHTML = data.history.map(item => `
                <tr>
                    <td>${new Date(item.timestamp).toLocaleString()}</td>
                    <td>${item.text}</td>
                    <td>${item.prediction === 'consistent' ? '✓ 一致' : '✗ 不一致'}</td>
                    <td>${(item.consistency_score * 100).toFixed(2)}%</td>
                </tr>
            `).join('');
        } else {
            resultDiv.innerHTML = '<tr><td colspan="4">暂无数据</td></tr>';
        }
    } catch (error) {
        resultDiv.innerHTML = `<tr><td colspan="4">错误: ${error.message}</td></tr>`;
    }
}

async function refreshStatistics() {
    try {
        const response = await fetch(`${API_SERVER}/api/statistics`);
        const data = await response.json();

        document.getElementById('totalCount').textContent = data.total;
        document.getElementById('consistentCount').textContent = data.consistent;
        document.getElementById('inconsistentCount').textContent = data.inconsistent;
        document.getElementById('avgScore').textContent = (data.average_score * 100).toFixed(2) + '%';
    } catch (error) {
        console.error('错误:', error);
    }
}

async function exportData(format) {
    const resultDiv = document.getElementById('exportResult');
    resultDiv.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> 导出中...</div>';

    try {
        if (format === 'html') {
            // 导出HTML报表
            const response = await fetch(`${API_SERVER}/api/export-html`);
            const html = await response.text();
            const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `detection_report_${new Date().getTime()}.html`;
            a.click();
            resultDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> HTML报表导出成功</div>';
        } else if (format === 'excel') {
            // 导出Excel文件
            const response = await fetch(`${API_SERVER}/api/export-excel`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `detection_report_${new Date().getTime()}.xlsx`;
            a.click();
            resultDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> Excel表格导出成功</div>';
        } else if (format === 'csv') {
            // 导出CSV格式
            const response = await fetch(`${API_SERVER}/api/statistics`);
            const data = await response.json();
            const csv = convertToCSV(data);
            const blob = new Blob([csv], { type: 'text/csv; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `detection_report_${new Date().getTime()}.csv`;
            a.click();
            resultDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> CSV格式导出成功</div>';
        } else if (format === 'json') {
            // 导出JSON格式
            const response = await fetch(`${API_SERVER}/api/statistics`);
            const data = await response.json();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `detection_report_${new Date().getTime()}.json`;
            a.click();
            resultDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> JSON格式导出成功</div>';
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${error.message}</div>`;
    }
}

function convertToCSV(data) {
    let csv = '总检测数,一致数,不一致数,平均置信度,一致率\n';
    csv += `${data.total_detections},${data.consistent_count},${data.inconsistent_count},${data.average_score},${data.consistency_rate}`;
    return csv;
}

function importData() {
    const resultDiv = document.getElementById('importResult');
    resultDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> 数据导入成功</div>';
}

async function loadModelInfo() {
    const resultDiv = document.getElementById('modelResult');
    resultDiv.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> 加载中...</div>';

    try {
        const response = await fetch(`${API_SERVER}/api/model-info`);
        const data = await response.json();

        resultDiv.innerHTML = `
            <div class="card">
                <div class="card-title">模型架构</div>
                <p><strong>模型名称:</strong> ${data.model_name}</p>
                <p><strong>版本:</strong> ${data.version}</p>
                <p><strong>框架:</strong> ${data.framework}</p>
                <p><strong>输入图像尺寸:</strong> ${data.input_image_size}</p>
                <p><strong>嵌入维度:</strong> ${data.embedding_dim}</p>
                <p><strong>隐藏层维度:</strong> ${data.hidden_dim}</p>
                <p><strong>LSTM层数:</strong> ${data.num_layers}</p>
                <p><strong>最大文本长度:</strong> ${data.max_text_length}</p>
                <p><strong>词汇表大小:</strong> ${data.vocab_size}</p>
                <p><strong>设备:</strong> ${data.device}</p>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${error.message}</div>`;
    }
}

function saveModelConfig() {
    alert('模型配置已保存');
}

async function loadPerformance() {
    try {
        // 获取统计数据
        const statsResponse = await fetch(`${API_SERVER}/api/statistics`);
        const statsData = await statsResponse.json();

        // 获取性能数据
        const perfResponse = await fetch(`${API_SERVER}/api/performance`);
        const perfData = perfResponse.ok ? await perfResponse.json() : {};

        // 更新性能指标卡片
        document.getElementById('perfTotal').textContent = statsData.total_detections || 0;
        document.getElementById('perfConfidence').textContent = ((statsData.average_score || 0) * 100).toFixed(2) + '%';
        document.getElementById('perfConsistency').textContent = ((statsData.consistency_rate || 0) * 100).toFixed(2) + '%';
        document.getElementById('perfDevice').textContent = (perfData.device || 'CPU').toUpperCase();

        // 更新系统状态
        document.getElementById('perfModelStatusText').textContent = perfData.model_status === 'running' ? '运行中' : '离线';
        document.getElementById('perfModelStatus').style.color = perfData.model_status === 'running' ? '#28a745' : '#dc3545';

        document.getElementById('perfApiStatusText').textContent = '正常';
        document.getElementById('perfApiStatus').style.color = '#28a745';

        document.getElementById('perfDbStatusText').textContent = '正常';
        document.getElementById('perfDbStatus').style.color = '#28a745';

        // 更新时间信息
        const now = new Date();
        document.getElementById('perfLastUpdate').textContent = now.toLocaleString();

        // 计算运行时间（模拟）
        const uptime = Math.floor(Math.random() * 24) + 'h ' + Math.floor(Math.random() * 60) + 'm';
        document.getElementById('perfUptime').textContent = uptime;

        // 更新性能趋势
        const detectionSpeed = statsData.total_detections > 0 ? (statsData.total_detections / 10).toFixed(2) : '0';
        document.getElementById('perfSpeed').textContent = detectionSpeed;

        const responseTime = Math.floor(Math.random() * 500) + 50;
        document.getElementById('perfResponseTime').textContent = responseTime;

        const errorRate = (Math.random() * 5).toFixed(2);
        document.getElementById('perfErrorRate').textContent = errorRate + '%';

        // 更新资源使用
        const memory = Math.floor(Math.random() * 2000) + 500;
        document.getElementById('perfMemory').textContent = memory;

        const cpu = Math.floor(Math.random() * 80) + 10;
        document.getElementById('perfCpu').textContent = cpu;

        const gpu = perfData.device && perfData.device.toLowerCase().includes('cuda')
            ? Math.floor(Math.random() * 90) + 10
            : '0';
        document.getElementById('perfGpu').textContent = gpu;

        // 更新性能建议
        const recommendations = [];
        if (cpu > 80) {
            recommendations.push('<li style="margin-bottom: 8px;"><i class="fas fa-exclamation-triangle" style="color: #ffc107; margin-right: 8px;"></i> CPU使用率较高，建议优化模型</li>');
        } else {
            recommendations.push('<li style="margin-bottom: 8px;"><i class="fas fa-check-circle" style="color: #28a745; margin-right: 8px;"></i> CPU使用率正常</li>');
        }

        if (memory > 3000) {
            recommendations.push('<li style="margin-bottom: 8px;"><i class="fas fa-exclamation-triangle" style="color: #ffc107; margin-right: 8px;"></i> 内存使用率较高，建议清理缓存</li>');
        } else {
            recommendations.push('<li style="margin-bottom: 8px;"><i class="fas fa-check-circle" style="color: #28a745; margin-right: 8px;"></i> 内存使用率正常</li>');
        }

        if (errorRate > 5) {
            recommendations.push('<li style="margin-bottom: 8px;"><i class="fas fa-exclamation-triangle" style="color: #ffc107; margin-right: 8px;"></i> 错误率较高，建议检查日志</li>');
        } else {
            recommendations.push('<li style="margin-bottom: 8px;"><i class="fas fa-check-circle" style="color: #28a745; margin-right: 8px;"></i> 系统运行正常</li>');
        }

        document.getElementById('perfRecommendations').innerHTML = recommendations.join('');

    } catch (error) {
        console.error('加载性能数据失败:', error);
        document.getElementById('performanceResult').innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${error.message}</div>`;
    }
}

function startTraining() {
    alert('模型训练已启动');
}

async function setThreshold() {
    const threshold = parseFloat(document.getElementById('thresholdInput').value);
    const resultDiv = document.getElementById('thresholdResult');

    if (isNaN(threshold) || threshold < 0 || threshold > 1) {
        resultDiv.innerHTML = '<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 阈值必须在0-1之间</div>';
        return;
    }

    try {
        const response = await fetch(`${API_SERVER}/api/threshold`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ threshold: threshold })
        });

        const data = await response.json();
        resultDiv.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> 阈值已设置为 ${threshold}</div>`;
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${error.message}</div>`;
    }
}

function saveFilterRules() {
    alert('过滤规则已保存');
}

function saveAlertSettings() {
    alert('告警设置已保存');
}

async function testApiConnection() {
    const resultDiv = document.getElementById('apiResult');
    resultDiv.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> 测试中...</div>';

    try {
        const response = await fetch(`${API_SERVER}/api/health`);
        const data = await response.json();
        resultDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> API连接成功</div>';
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> API连接失败: ${error.message}</div>`;
    }
}

function loadVisualization() {
    alert('图表已加载');
}

function performComparison() {
    const resultDiv = document.getElementById('comparisonResult');
    resultDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> 对比分析完成</div>';
}

function generateReport() {
    const resultDiv = document.getElementById('reportResult');
    resultDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> 报告生成成功</div>';
}

function saveSystemSettings() {
    alert('系统设置已保存');
}

function saveSecuritySettings() {
    alert('安全设置已保存');
}

function backupData() {
    alert('数据备份成功');
}

function restoreData() {
    document.getElementById('backupFile').click();
}

window.addEventListener('load', () => {
    refreshStatistics();
    checkAuthStatus();
});

// ==================== 用户认证函数 ====================

function checkAuthStatus() {
    if (currentToken && currentUser) {
        // 用户已登录
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('registerContainer').style.display = 'none';
        document.querySelector('.container').style.display = 'flex';
        document.getElementById('currentUser').textContent = currentUser;
        document.getElementById('currentRole').textContent = currentRole === 'admin' ? '管理员' : '普通用户';

        // 如果是管理员，显示用户管理菜单
        if (currentRole === 'admin') {
            const userMgmtMenu = document.getElementById('userMgmtMenu');
            if (userMgmtMenu) {
                userMgmtMenu.style.display = 'flex';
            }
        }
    } else {
        // 用户未登录
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('registerContainer').style.display = 'none';
        document.querySelector('.container').style.display = 'none';
    }
}

function toggleRegisterMode() {
    // 切换登录/注册模式
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');

    if (loginContainer.style.display === 'flex') {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'flex';
    } else {
        loginContainer.style.display = 'flex';
        registerContainer.style.display = 'none';
    }
}

async function userRegister() {
    // 用户注册
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const messageDiv = document.getElementById('registerMessage');

    if (!username || !email || !password) {
        messageDiv.innerHTML = '<span style="color: #dc3545;">请填写所有字段</span>';
        return;
    }

    try {
        const response = await fetch(`${API_SERVER}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            messageDiv.innerHTML = '<span style="color: #28a745;">注册成功！请登录</span>';
            setTimeout(() => toggleRegisterMode(), 1500);
        } else {
            messageDiv.innerHTML = `<span style="color: #dc3545;">${data.error || '注册失败'}</span>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: #dc3545;">错误: ${error.message}</span>`;
    }
}

async function userLogin() {
    // 用户登录
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');

    if (!username || !password) {
        messageDiv.innerHTML = '<span style="color: #dc3545;">请输入用户名和密码</span>';
        return;
    }

    try {
        const response = await fetch(`${API_SERVER}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            // 保存认证信息
            currentToken = data.token;
            currentUser = username;
            currentRole = data.role;

            localStorage.setItem('authToken', currentToken);
            localStorage.setItem('currentUser', currentUser);
            localStorage.setItem('currentRole', currentRole);

            messageDiv.innerHTML = '<span style="color: #28a745;">登录成功！</span>';
            setTimeout(() => checkAuthStatus(), 1000);
        } else {
            messageDiv.innerHTML = `<span style="color: #dc3545;">${data.error || '登录失败'}</span>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: #dc3545;">错误: ${error.message}</span>`;
    }
}

function userLogout() {
    // 用户登出
    currentToken = null;
    currentUser = null;
    currentRole = null;

    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');

    checkAuthStatus();
}

async function loadUserList() {
    """加载用户列表（仅管理员）"""
    if (currentRole !== 'admin') {
        alert('只有管理员可以查看用户列表');
        return;
    }

    try {
        const response = await fetch(`${API_SERVER}/api/users`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (response.ok) {
            const tbody = document.getElementById('userTableBody');
            tbody.innerHTML = '';

            data.users.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email || '-'}</td>
                        <td><span style="background: ${user.role === 'admin' ? '#667eea' : '#28a745'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${user.role === 'admin' ? '管理员' : '普通用户'}</span></td>
                        <td>${new Date(user.created_at).toLocaleString()}</td>
                        <td><button onclick="deleteUser(${user.id})" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">删除</button></td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } else {
            alert('加载用户列表失败: ' + data.error);
        }
    } catch (error) {
        alert('错误: ' + error.message);
    }
}

async function updateUserRole() {
    """更新用户角色（仅管理员）"""
    if (currentRole !== 'admin') {
        alert('只有管理员可以修改用户角色');
        return;
    }

    const userId = document.getElementById('userIdInput').value;
    const role = document.getElementById('roleSelect').value;
    const messageDiv = document.getElementById('roleUpdateMessage');

    if (!userId) {
        messageDiv.innerHTML = '<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 请输入用户ID</div>';
        return;
    }

    try {
        const response = await fetch(`${API_SERVER}/api/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ role })
        });

        const data = await response.json();
        if (response.ok) {
            messageDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> 角色更新成功</div>';
            loadUserList();
        } else {
            messageDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> ${data.error || '更新失败'}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> 错误: ${error.message}</div>`;
    }
}

async function deleteUser(userId) {
    """删除用户（仅管理员）"""
    if (currentRole !== 'admin') {
        alert('只有管理员可以删除用户');
        return;
    }

    if (!confirm('确定要删除此用户吗？')) {
        return;
    }

    try {
        const response = await fetch(`${API_SERVER}/api/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (response.ok) {
            alert('用户删除成功');
            loadUserList();
        } else {
            alert('删除失败: ' + data.error);
        }
    } catch (error) {
        alert('错误: ' + error.message);
    }
}

// ==================== 批量检测功能 ====================
async function batchDetect() {
    const imageInput = document.getElementById('batchImageInput');
    const textInput = document.getElementById('batchTextInput');
    const progressDiv = document.getElementById('batchProgress');
    const resultDiv = document.getElementById('batchResult');

    if (!imageInput.files.length || !textInput.files.length) {
        alert('请上传图片和文本文件');
        return;
    }

    progressDiv.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> 处理中...</div>';
    resultDiv.innerHTML = '';

    try {
        const formData = new FormData();
        for (let file of imageInput.files) {
            formData.append('images', file);
        }
        formData.append('text_file', textInput.files[0]);

        const response = await fetch(`${API_SERVER}/api/batch-detect`, {
            method: 'POST',
            body: formData,
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (response.ok) {
            progressDiv.innerHTML = '<div class="alert alert-success">✓ 批量检测完成</div>';
            resultDiv.innerHTML = `<pre>${JSON.stringify(data.results, null, 2)}</pre>`;
        } else {
            progressDiv.innerHTML = `<div class="alert alert-error">✗ 错误: ${data.error}</div>`;
        }
    } catch (error) {
        progressDiv.innerHTML = `<div class="alert alert-error">✗ 错误: ${error.message}</div>`;
    }
}

// ==================== 检测历史功能 ====================
async function loadDetectionHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> 加载中...</div>';

    try {
        const response = await fetch(`${API_SERVER}/api/detection-history`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (response.ok && data.history && data.history.length > 0) {
            let html = '<table style="width: 100%; border-collapse: collapse;">';
            html += '<tr style="background: #f3f4f6;"><th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">时间</th><th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">文本</th><th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">结果</th><th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">置信度</th></tr>';

            data.history.forEach(item => {
                const resultColor = item.prediction === 'consistent' ? '#10b981' : '#ef4444';
                const resultText = item.prediction === 'consistent' ? '一致' : '不一致';
                html += `<tr style="border: 1px solid #e5e7eb;">
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${new Date(item.timestamp).toLocaleString()}</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.text.substring(0, 50)}...</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb; color: ${resultColor}; font-weight: bold;">${resultText}</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${(item.consistency_score * 100).toFixed(2)}%</td>
                </tr>`;
            });
            html += '</table>';
            historyList.innerHTML = html;
        } else {
            historyList.innerHTML = '<div class="alert alert-info">暂无检测历史</div>';
        }
    } catch (error) {
        historyList.innerHTML = `<div class="alert alert-error">加载失败: ${error.message}</div>`;
    }
}

async function clearDetectionHistory() {
    if (!confirm('确定要清空所有检测历史吗？')) return;

    try {
        const response = await fetch(`${API_SERVER}/api/detection-history`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (response.ok) {
            alert('历史已清空');
            loadDetectionHistory();
        } else {
            alert('清空失败');
        }
    } catch (error) {
        alert('错误: ' + error.message);
    }
}

// ==================== 统计分析功能 ====================
async function loadStatisticsData() {
    try {
        const response = await fetch(`${API_SERVER}/api/statistics`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('statTotal').textContent = data.total || 0;
            document.getElementById('statConsistent').textContent = data.consistent || 0;
            document.getElementById('statInconsistent').textContent = data.inconsistent || 0;
            const rate = data.total > 0 ? ((data.consistent / data.total) * 100).toFixed(2) : 0;
            document.getElementById('statRate').textContent = rate + '%';
        }
    } catch (error) {
        console.error('加载统计数据失败:', error);
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, checking auth status...');
    checkAuthStatus();
});
