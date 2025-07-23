import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
    padding: 2rem;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    min-height: 100vh;
`;

const PageHeader = styled.header`
    margin-bottom: 2rem;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 600;
    color: #00d4ff;
    margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
    color: #999;
    margin: 0;
    font-size: 1rem;
`;

const SettingsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 800px;
`;

const SettingsSection = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
`;

const SectionTitle = styled.h3`
    color: #00d4ff;
    margin: 0 0 1.5rem 0;
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const SettingItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #333;

    &:last-child {
        border-bottom: none;
    }
`;

const SettingInfo = styled.div`
    flex: 1;
`;

const SettingLabel = styled.div`
    color: #fff;
    font-weight: 600;
    margin-bottom: 0.25rem;
`;

const SettingDescription = styled.div`
    color: #999;
    font-size: 0.9rem;
`;

const SettingControl = styled.div`
    margin-left: 1rem;
`;

const Toggle = styled.button.withConfig({
    shouldForwardProp: (prop) => prop !== 'active',
})`
    width: 50px;
    height: 24px;
    border-radius: 12px;
    border: none;
    background: ${(props) => (props.active ? '#00d4ff' : '#333')};
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;

    &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: ${(props) => (props.active ? '28px' : '2px')};
        width: 20px;
        height: 20px;
        background: #fff;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
`;

const Select = styled.select`
    background: #333;
    border: 1px solid #555;
    border-radius: 6px;
    color: #fff;
    padding: 0.5rem;
    font-size: 0.9rem;
    min-width: 120px;

    &:focus {
        outline: none;
        border-color: #00d4ff;
    }
`;

const Input = styled.input`
    background: #333;
    border: 1px solid #555;
    border-radius: 6px;
    color: #fff;
    padding: 0.5rem;
    font-size: 0.9rem;
    min-width: 120px;

    &:focus {
        outline: none;
        border-color: #00d4ff;
    }
`;

const Button = styled.button.withConfig({
    shouldForwardProp: (prop) => prop !== 'primary',
})`
    background: ${(props) => (props.primary ? 'linear-gradient(45deg, #00d4ff, #0099cc)' : '#333')};
    border: 1px solid ${(props) => (props.primary ? '#00d4ff' : '#555')};
    border-radius: 6px;
    color: ${(props) => (props.primary ? '#000' : '#fff')};
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${(props) => (props.primary ? '#00d4ff' : '#444')};
        transform: translateY(-1px);
    }
`;

const VersionInfo = styled.div`
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid #00d4ff;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
`;

const VersionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
`;

const VersionItem = styled.div`
    text-align: center;
`;

const VersionLabel = styled.div`
    color: #999;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
`;

const VersionValue = styled.div`
    color: #00d4ff;
    font-weight: 600;
`;

const ApiKeySection = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
`;

const ApiKeyGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
`;

const ApiKeyInput = styled.input`
    background: #333;
    border: 1px solid #555;
    border-radius: 6px;
    color: #fff;
    padding: 0.75rem;
    font-size: 0.9rem;
    font-family: 'Courier New', monospace;
    flex: 1;

    &:focus {
        outline: none;
        border-color: #00d4ff;
    }
`;

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        // User Preferences
        darkMode: true,
        realTimeUpdates: true,
        notifications: true,
        autoRefresh: true,
        refreshInterval: '30',

        // Display Settings
        theme: 'dark',
        density: 'comfortable',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',

        // Security Settings
        sessionTimeout: '60',
        twoFactorAuth: false,
        apiAccess: true,
        auditLogging: true,

        // API Configuration
        splunkApiKey: '',
        threatConnectKey: '',
        virusTotalKey: '',
        crowdStrikeKey: '',
    });

    const handleToggle = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSelectChange = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSaveSettings = () => {
        // In a real app, this would save to backend/Splunk
        console.log('Saving settings:', settings);
        alert('Settings saved successfully!');
    };

    const handleResetDefaults = () => {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            setSettings({
                darkMode: true,
                realTimeUpdates: true,
                notifications: true,
                autoRefresh: true,
                refreshInterval: '30',
                theme: 'dark',
                density: 'comfortable',
                timezone: 'UTC',
                dateFormat: 'MM/DD/YYYY',
                sessionTimeout: '60',
                twoFactorAuth: false,
                apiAccess: true,
                auditLogging: true,
                splunkApiKey: '',
                threatConnectKey: '',
                virusTotalKey: '',
                crowdStrikeKey: '',
            });
        }
    };

    return (
        <PageContainer>
            <PageHeader>
                <Title>⚙️ Settings</Title>
                <Subtitle>User profile management and app configuration</Subtitle>
            </PageHeader>

            <SettingsGrid>
                <SettingsSection>
                    <SectionTitle>👤 User Preferences</SectionTitle>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Dark Mode</SettingLabel>
                            <SettingDescription>
                                Use dark theme optimized for SOC environments
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Toggle
                                active={settings.darkMode}
                                onClick={() => handleToggle('darkMode')}
                            />
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Real-time Updates</SettingLabel>
                            <SettingDescription>
                                Automatically update threat data and metrics
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Toggle
                                active={settings.realTimeUpdates}
                                onClick={() => handleToggle('realTimeUpdates')}
                            />
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Push Notifications</SettingLabel>
                            <SettingDescription>
                                Receive alerts for critical threats
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Toggle
                                active={settings.notifications}
                                onClick={() => handleToggle('notifications')}
                            />
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Auto Refresh</SettingLabel>
                            <SettingDescription>
                                Automatically refresh data at set intervals
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Toggle
                                active={settings.autoRefresh}
                                onClick={() => handleToggle('autoRefresh')}
                            />
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Refresh Interval</SettingLabel>
                            <SettingDescription>
                                How often to update data (seconds)
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Select
                                value={settings.refreshInterval}
                                onChange={(e) =>
                                    handleSelectChange('refreshInterval', e.target.value)
                                }
                            >
                                <option value="10">10 seconds</option>
                                <option value="30">30 seconds</option>
                                <option value="60">1 minute</option>
                                <option value="300">5 minutes</option>
                            </Select>
                        </SettingControl>
                    </SettingItem>
                </SettingsSection>

                <SettingsSection>
                    <SectionTitle>🎨 Display Settings</SectionTitle>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Theme</SettingLabel>
                            <SettingDescription>
                                Choose your preferred color scheme
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Select
                                value={settings.theme}
                                onChange={(e) => handleSelectChange('theme', e.target.value)}
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="auto">Auto</option>
                            </Select>
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Display Density</SettingLabel>
                            <SettingDescription>
                                Control spacing and layout density
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Select
                                value={settings.density}
                                onChange={(e) => handleSelectChange('density', e.target.value)}
                            >
                                <option value="compact">Compact</option>
                                <option value="comfortable">Comfortable</option>
                                <option value="spacious">Spacious</option>
                            </Select>
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Timezone</SettingLabel>
                            <SettingDescription>
                                Display timestamps in your timezone
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Select
                                value={settings.timezone}
                                onChange={(e) => handleSelectChange('timezone', e.target.value)}
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern</option>
                                <option value="America/Chicago">Central</option>
                                <option value="America/Denver">Mountain</option>
                                <option value="America/Los_Angeles">Pacific</option>
                            </Select>
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Date Format</SettingLabel>
                            <SettingDescription>Choose how dates are displayed</SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Select
                                value={settings.dateFormat}
                                onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                            >
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </Select>
                        </SettingControl>
                    </SettingItem>
                </SettingsSection>

                <SettingsSection>
                    <SectionTitle>🔒 Security Settings</SectionTitle>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Session Timeout</SettingLabel>
                            <SettingDescription>
                                Automatically log out after inactivity (minutes)
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Select
                                value={settings.sessionTimeout}
                                onChange={(e) =>
                                    handleSelectChange('sessionTimeout', e.target.value)
                                }
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="240">4 hours</option>
                            </Select>
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Two-Factor Authentication</SettingLabel>
                            <SettingDescription>
                                Add extra security to your account
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Toggle
                                active={settings.twoFactorAuth}
                                onClick={() => handleToggle('twoFactorAuth')}
                            />
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>API Access</SettingLabel>
                            <SettingDescription>
                                Allow external API access to your data
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Toggle
                                active={settings.apiAccess}
                                onClick={() => handleToggle('apiAccess')}
                            />
                        </SettingControl>
                    </SettingItem>

                    <SettingItem>
                        <SettingInfo>
                            <SettingLabel>Audit Logging</SettingLabel>
                            <SettingDescription>
                                Log all user actions for security audits
                            </SettingDescription>
                        </SettingInfo>
                        <SettingControl>
                            <Toggle
                                active={settings.auditLogging}
                                onClick={() => handleToggle('auditLogging')}
                            />
                        </SettingControl>
                    </SettingItem>
                </SettingsSection>

                <SettingsSection>
                    <SectionTitle>🔑 API Configuration</SectionTitle>

                    <ApiKeySection>
                        <SettingLabel style={{ marginBottom: '1rem' }}>
                            Threat Intelligence APIs
                        </SettingLabel>

                        <SettingItem style={{ borderBottom: 'none', padding: '0.5rem 0' }}>
                            <SettingInfo>
                                <SettingLabel>Splunk API Key</SettingLabel>
                            </SettingInfo>
                            <SettingControl style={{ flex: 1, marginLeft: '1rem' }}>
                                <ApiKeyInput
                                    type="password"
                                    placeholder="Enter Splunk API key..."
                                    value={settings.splunkApiKey}
                                    onChange={(e) =>
                                        handleSelectChange('splunkApiKey', e.target.value)
                                    }
                                />
                            </SettingControl>
                        </SettingItem>

                        <SettingItem style={{ borderBottom: 'none', padding: '0.5rem 0' }}>
                            <SettingInfo>
                                <SettingLabel>ThreatConnect API Key</SettingLabel>
                            </SettingInfo>
                            <SettingControl style={{ flex: 1, marginLeft: '1rem' }}>
                                <ApiKeyInput
                                    type="password"
                                    placeholder="Enter ThreatConnect API key..."
                                    value={settings.threatConnectKey}
                                    onChange={(e) =>
                                        handleSelectChange('threatConnectKey', e.target.value)
                                    }
                                />
                            </SettingControl>
                        </SettingItem>

                        <SettingItem style={{ borderBottom: 'none', padding: '0.5rem 0' }}>
                            <SettingInfo>
                                <SettingLabel>VirusTotal API Key</SettingLabel>
                            </SettingInfo>
                            <SettingControl style={{ flex: 1, marginLeft: '1rem' }}>
                                <ApiKeyInput
                                    type="password"
                                    placeholder="Enter VirusTotal API key..."
                                    value={settings.virusTotalKey}
                                    onChange={(e) =>
                                        handleSelectChange('virusTotalKey', e.target.value)
                                    }
                                />
                            </SettingControl>
                        </SettingItem>

                        <SettingItem style={{ borderBottom: 'none', padding: '0.5rem 0' }}>
                            <SettingInfo>
                                <SettingLabel>CrowdStrike API Key</SettingLabel>
                            </SettingInfo>
                            <SettingControl style={{ flex: 1, marginLeft: '1rem' }}>
                                <ApiKeyInput
                                    type="password"
                                    placeholder="Enter CrowdStrike API key..."
                                    value={settings.crowdStrikeKey}
                                    onChange={(e) =>
                                        handleSelectChange('crowdStrikeKey', e.target.value)
                                    }
                                />
                            </SettingControl>
                        </SettingItem>
                    </ApiKeySection>
                </SettingsSection>

                <SettingsSection>
                    <SectionTitle>ℹ️ App Information</SectionTitle>

                    <VersionInfo>
                        <SettingLabel style={{ marginBottom: '1rem' }}>
                            ThreatLoom Version Information
                        </SettingLabel>
                        <VersionGrid>
                            <VersionItem>
                                <VersionLabel>App Version</VersionLabel>
                                <VersionValue>1.0.0</VersionValue>
                            </VersionItem>
                            <VersionItem>
                                <VersionLabel>Build Date</VersionLabel>
                                <VersionValue>2024-01-15</VersionValue>
                            </VersionItem>
                            <VersionItem>
                                <VersionLabel>Splunk Version</VersionLabel>
                                <VersionValue>9.1.2</VersionValue>
                            </VersionItem>
                            <VersionItem>
                                <VersionLabel>License</VersionLabel>
                                <VersionValue>Enterprise</VersionValue>
                            </VersionItem>
                        </VersionGrid>
                    </VersionInfo>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <Button primary onClick={handleSaveSettings}>
                            💾 Save Settings
                        </Button>
                        <Button onClick={handleResetDefaults}>🔄 Reset to Defaults</Button>
                    </div>
                </SettingsSection>
            </SettingsGrid>
        </PageContainer>
    );
};

export default SettingsPage;
