// ThreatLoom API Service - Comprehensive threat intelligence data service
class ThreatLoomAPI {
    constructor() {
        this.baseURL = '/api/v1';
        this.isDemo = true; // Set to false in production Splunk environment
        this.wsConnection = null;
        this.subscribers = new Map();
    }

    // ===== DASHBOARD DATA =====
    async getDashboardMetrics() {
        if (this.isDemo) {
            return this.generateMockDashboardData();
        }
        return this.splunkQuery(`
            | rest /services/data/indexes 
            | eval threat_count=random()%200+50
            | eval critical_alerts=random()%50+10
            | eval feeds_online=random()%2+7
            | eval avg_response=random()%5+2
        `);
    }

    generateMockDashboardData() {
        return {
            activeThreats: Math.floor(Math.random() * 50) + 100,
            criticalAlerts: Math.floor(Math.random() * 20) + 15,
            feedsOnline: Math.floor(Math.random() * 2) + 7,
            avgResponseTime: (Math.random() * 3 + 2).toFixed(1),
            threatVolume: this.generateTimeSeriesData(24, 50, 200),
            regionData: [
                { region: 'North America', threats: 45, severity: 'high' },
                { region: 'Europe', threats: 32, severity: 'medium' },
                { region: 'Asia Pacific', threats: 28, severity: 'high' },
                { region: 'Africa', threats: 12, severity: 'low' },
                { region: 'South America', threats: 8, severity: 'medium' },
            ],
        };
    }

    // ===== THREAT INDICATORS =====
    async getThreatIndicators(filters = {}) {
        if (this.isDemo) {
            return this.generateMockThreatIndicators(filters);
        }
        return this.splunkQuery(`
            | inputlookup threat_indicators.csv
            | search ${filters.type || '*'} ${filters.severity || '*'}
            | sort -_time
        `);
    }

    generateMockThreatIndicators(filters) {
        const types = ['IP', 'Domain', 'Hash', 'URL', 'Email'];
        const severities = ['Critical', 'High', 'Medium', 'Low'];
        const sources = ['CrowdStrike', 'VirusTotal', 'ThreatConnect', 'Internal', 'MISP'];

        const indicators = [];
        for (let i = 0; i < 500; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const indicator = {
                id: `IOC-${String(i).padStart(4, '0')}`,
                type,
                value: this.generateIOCValue(type),
                severity: severities[Math.floor(Math.random() * severities.length)],
                source: sources[Math.floor(Math.random() * sources.length)],
                firstSeen: new Date(
                    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                confidence: Math.floor(Math.random() * 40) + 60,
                tags: this.generateTags(),
                description: this.generateThreatDescription(type),
            };
            indicators.push(indicator);
        }

        return this.applyFilters(indicators, filters);
    }

    generateIOCValue(type) {
        switch (type) {
            case 'IP':
                return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            case 'Domain':
                const domains = [
                    'malware-c2.com',
                    'phishing-site.net',
                    'evil-domain.org',
                    'threat-actor.biz',
                ];
                return domains[Math.floor(Math.random() * domains.length)];
            case 'Hash':
                return Array.from({ length: 64 }, () =>
                    Math.floor(Math.random() * 16).toString(16),
                ).join('');
            case 'URL':
                return `https://malicious-site.com/payload${Math.floor(Math.random() * 1000)}`;
            case 'Email':
                return `threat-actor${Math.floor(Math.random() * 100)}@malicious-domain.com`;
            default:
                return 'unknown';
        }
    }

    // ===== ANOMALY DETECTION =====
    async getAnomalies(timeRange = '24h') {
        if (this.isDemo) {
            return this.generateMockAnomalies();
        }
        return this.splunkQuery(`
            | search index=security earliest=-${timeRange}
            | anomalydetection action=annotate
            | where anomaly_score > 0.5
        `);
    }

    generateMockAnomalies() {
        return {
            summary: {
                totalAnomalies: 127,
                criticalAnomalies: 23,
                newToday: 15,
                falsePositiveRate: 12,
            },
            categories: [
                { name: 'Login Anomalies', count: 45, severity: 'high', trend: 'up' },
                { name: 'Network Traffic', count: 32, severity: 'medium', trend: 'down' },
                { name: 'DNS Queries', count: 28, severity: 'high', trend: 'stable' },
                { name: 'File Access', count: 22, severity: 'medium', trend: 'up' },
            ],
            recentAnomalies: this.generateAnomalyList(50),
            timeSeries: this.generateTimeSeriesData(24, 5, 25),
        };
    }

    generateAnomalyList(count) {
        const types = ['Login Spike', 'Unusual DNS', 'Port Scan', 'Data Exfil', 'Lateral Movement'];
        const anomalies = [];

        for (let i = 0; i < count; i++) {
            anomalies.push({
                id: `ANOM-${String(i).padStart(4, '0')}`,
                type: types[Math.floor(Math.random() * types.length)],
                severity: ['Critical', 'High', 'Medium'][Math.floor(Math.random() * 3)],
                timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                source: `host-${Math.floor(Math.random() * 100)}`,
                description: 'Suspicious activity detected by ML model',
                score: (Math.random() * 0.5 + 0.5).toFixed(2),
            });
        }

        return anomalies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // ===== ALERTS & INCIDENTS =====
    async getAlerts(status = 'all') {
        if (this.isDemo) {
            return this.generateMockAlerts();
        }
        return this.splunkQuery(`
            | search index=alerts status=${status}
            | sort -_time
        `);
    }

    generateMockAlerts() {
        const alerts = [];
        const statuses = ['Open', 'Investigating', 'Resolved', 'False Positive'];
        const severities = ['Critical', 'High', 'Medium', 'Low'];

        for (let i = 0; i < 200; i++) {
            alerts.push({
                id: `ALERT-${String(i).padStart(4, '0')}`,
                title: this.generateAlertTitle(),
                severity: severities[Math.floor(Math.random() * severities.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                created: new Date(
                    Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                assignee: this.generateAnalystName(),
                source: 'SIEM',
                mitreTactics: this.generateMitreTactics(),
                affectedSystems: Math.floor(Math.random() * 10) + 1,
            });
        }

        return alerts.sort((a, b) => new Date(b.created) - new Date(a.created));
    }

    generateAlertTitle() {
        const titles = [
            'Suspicious PowerShell Execution',
            'Potential Data Exfiltration',
            'Malware Communication Detected',
            'Unauthorized Admin Access',
            'Lateral Movement Attempt',
            'Credential Stuffing Attack',
            'DDoS Attack Detected',
            'Phishing Email Campaign',
        ];
        return titles[Math.floor(Math.random() * titles.length)];
    }

    // ===== THREAT ANALYTICS =====
    async getThreatAnalytics() {
        if (this.isDemo) {
            return this.generateMockThreatAnalytics();
        }
        return this.splunkQuery(`
            | search index=threat_intel 
            | stats count by threat_actor, attack_vector, target_industry
        `);
    }

    generateMockThreatAnalytics() {
        return {
            threatActors: [
                { name: 'APT29', campaigns: 15, severity: 'Critical', lastSeen: '2024-01-10' },
                { name: 'Lazarus Group', campaigns: 12, severity: 'High', lastSeen: '2024-01-08' },
                { name: 'FIN7', campaigns: 8, severity: 'High', lastSeen: '2024-01-05' },
                { name: 'Carbanak', campaigns: 6, severity: 'Medium', lastSeen: '2024-01-03' },
            ],
            attackVectors: [
                { vector: 'Phishing', percentage: 35, trend: 'up' },
                { vector: 'Malware', percentage: 28, trend: 'stable' },
                { vector: 'Social Engineering', percentage: 18, trend: 'up' },
                { vector: 'Exploit Kit', percentage: 12, trend: 'down' },
                { vector: 'Watering Hole', percentage: 7, trend: 'stable' },
            ],
            industryTargets: [
                { industry: 'Financial', attacks: 156, percentage: 42 },
                { industry: 'Healthcare', attacks: 89, percentage: 24 },
                { industry: 'Government', attacks: 67, percentage: 18 },
                { industry: 'Technology', attacks: 45, percentage: 12 },
                { industry: 'Energy', attacks: 15, percentage: 4 },
            ],
            mitreTactics: this.generateMitreHeatmap(),
        };
    }

    // ===== INTELLIGENCE FEEDS =====
    async getIntelligenceFeeds() {
        if (this.isDemo) {
            return this.generateMockFeeds();
        }
        return this.splunkQuery(`
            | rest /services/data/inputs/tcp/cooked
            | eval feed_status=if(disabled=0, "Active", "Inactive")
        `);
    }

    generateMockFeeds() {
        const feeds = [
            {
                id: 'feed-001',
                name: 'CrowdStrike Falcon Feed',
                type: 'Commercial',
                status: 'Active',
                lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                recordCount: 15420,
                quality: 98,
                latency: '2m',
                format: 'JSON',
            },
            {
                id: 'feed-002',
                name: 'VirusTotal Intelligence',
                type: 'Commercial',
                status: 'Active',
                lastUpdate: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
                recordCount: 8934,
                quality: 96,
                latency: '1m',
                format: 'CSV',
            },
            {
                id: 'feed-003',
                name: 'MISP Community Feed',
                type: 'Open Source',
                status: 'Active',
                lastUpdate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                recordCount: 5678,
                quality: 87,
                latency: '5m',
                format: 'JSON',
            },
            {
                id: 'feed-004',
                name: 'Internal Threat Intel',
                type: 'Internal',
                status: 'Active',
                lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                recordCount: 1234,
                quality: 94,
                latency: '10m',
                format: 'CSV',
            },
            {
                id: 'feed-005',
                name: 'ThreatConnect IOCs',
                type: 'Commercial',
                status: 'Warning',
                lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                recordCount: 12567,
                quality: 78,
                latency: '45m',
                format: 'XML',
            },
        ];

        return feeds;
    }

    // ===== PLAYBOOKS =====
    async getPlaybooks() {
        if (this.isDemo) {
            return this.generateMockPlaybooks();
        }
        return this.splunkQuery(`
            | inputlookup playbooks.csv
            | eval automation_ready=if(automated="yes", true, false)
        `);
    }

    generateMockPlaybooks() {
        return [
            {
                id: 'PB-001',
                title: 'Malware Incident Response',
                category: 'Incident Response',
                steps: 8,
                avgDuration: '45 minutes',
                automationReady: true,
                lastUsed: '2024-01-10',
                usage: 127,
            },
            {
                id: 'PB-002',
                title: 'Phishing Email Investigation',
                category: 'Email Security',
                steps: 12,
                avgDuration: '30 minutes',
                automationReady: false,
                lastUsed: '2024-01-09',
                usage: 89,
            },
            {
                id: 'PB-003',
                title: 'IOC Enrichment Process',
                category: 'Threat Intelligence',
                steps: 6,
                avgDuration: '15 minutes',
                automationReady: true,
                lastUsed: '2024-01-10',
                usage: 234,
            },
            {
                id: 'PB-004',
                title: 'Lateral Movement Detection',
                category: 'Network Security',
                steps: 10,
                avgDuration: '60 minutes',
                automationReady: false,
                lastUsed: '2024-01-08',
                usage: 45,
            },
        ];
    }

    // ===== UTILITY METHODS =====
    generateTimeSeriesData(hours, min, max) {
        const data = [];
        for (let i = hours; i >= 0; i--) {
            const timestamp = new Date(Date.now() - i * 60 * 60 * 1000);
            const value = Math.floor(Math.random() * (max - min) + min);
            data.push({ timestamp: timestamp.toISOString(), value });
        }
        return data;
    }

    generateTags() {
        const tags = ['malware', 'c2', 'phishing', 'trojan', 'apt', 'ransomware', 'botnet'];
        const count = Math.floor(Math.random() * 3) + 1;
        return Array.from({ length: count }, () => tags[Math.floor(Math.random() * tags.length)]);
    }

    generateThreatDescription(type) {
        const descriptions = {
            IP: 'Suspicious IP address associated with known threat actor',
            Domain: 'Malicious domain used for C2 communication',
            Hash: 'File hash of known malware sample',
            URL: 'Malicious URL hosting exploit kit',
            Email: 'Email address used in phishing campaigns',
        };
        return descriptions[type] || 'Unknown threat indicator';
    }

    generateAnalystName() {
        const names = ['Sarah Chen', 'Mike Rodriguez', 'Alex Kim', 'Lisa Johnson', 'David Park'];
        return names[Math.floor(Math.random() * names.length)];
    }

    generateMitreTactics() {
        const tactics = [
            'Initial Access',
            'Execution',
            'Persistence',
            'Defense Evasion',
            'Discovery',
        ];
        const count = Math.floor(Math.random() * 3) + 1;
        return Array.from(
            { length: count },
            () => tactics[Math.floor(Math.random() * tactics.length)],
        );
    }

    generateMitreHeatmap() {
        const tactics = [
            'Initial Access',
            'Execution',
            'Persistence',
            'Privilege Escalation',
            'Defense Evasion',
            'Credential Access',
            'Discovery',
            'Lateral Movement',
            'Collection',
            'Command and Control',
            'Exfiltration',
            'Impact',
        ];

        return tactics.map((tactic) => ({
            tactic,
            techniques: Math.floor(Math.random() * 20) + 5,
            detections: Math.floor(Math.random() * 100) + 10,
            coverage: Math.floor(Math.random() * 50) + 50,
        }));
    }

    applyFilters(data, filters) {
        let filtered = [...data];

        if (filters.type) {
            filtered = filtered.filter((item) => item.type === filters.type);
        }
        if (filters.severity) {
            filtered = filtered.filter((item) => item.severity === filters.severity);
        }
        if (filters.search) {
            filtered = filtered.filter((item) =>
                item.value.toLowerCase().includes(filters.search.toLowerCase()),
            );
        }

        return filtered.slice(0, filters.limit || 100);
    }

    // ===== SPLUNK INTEGRATION =====
    async splunkQuery(query) {
        if (this.isDemo) {
            console.log(`Demo Mode - Would execute SPL: ${query}`);
            return { demo: true, query };
        }

        try {
            const response = await fetch('/servicesNS/admin/threat_loom/search/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Splunk ${this.getSessionKey()}`,
                },
                body: `search=${encodeURIComponent(query)}`,
            });

            const jobId = await response.text();
            return this.pollSearchJob(jobId);
        } catch (error) {
            console.error('Splunk query error:', error);
            throw error;
        }
    }

    async pollSearchJob(jobId) {
        // Implementation for polling Splunk search job status
        // This would be used in a real Splunk environment
        return new Promise((resolve) => {
            setTimeout(() => resolve({ results: [] }), 1000);
        });
    }

    getSessionKey() {
        // Get Splunk session key from browser storage or cookie
        return localStorage.getItem('splunk_session_key') || 'demo_key';
    }

    // ===== REAL-TIME UPDATES =====
    subscribeToUpdates(callback) {
        const subscriberId = Math.random().toString(36);
        this.subscribers.set(subscriberId, callback);

        // Simulate real-time updates in demo mode
        if (this.isDemo) {
            setInterval(() => {
                callback({
                    type: 'metrics_update',
                    data: this.generateMockDashboardData(),
                });
            }, 10000);
        }

        return subscriberId;
    }

    unsubscribeFromUpdates(subscriberId) {
        this.subscribers.delete(subscriberId);
    }
}

// Export singleton instance
const threatLoomAPI = new ThreatLoomAPI();
export default threatLoomAPI;
