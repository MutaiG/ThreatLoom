import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
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

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const MetricCard = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: ${(props) => props.color || '#00d4ff'};
    }
`;

const MetricValue = styled.div`
    font-size: 2.5rem;
    font-weight: 700;
    color: ${(props) => props.color || '#00d4ff'};
    margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
    color: #ccc;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
`;

const MetricChange = styled.div`
    font-size: 0.8rem;
    color: ${(props) => (props.positive ? '#00ff88' : '#ff4444')};
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const ChartsGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ChartPanel = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
`;

const ChartTitle = styled.h3`
    color: #00d4ff;
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 600;
`;

const ThreatMap = styled.div`
    height: 300px;
    background: radial-gradient(circle at center, #0a3a4a 0%, #051a2a 100%);
    border: 1px solid #1a4a5a;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #66ccdd;
    font-size: 1.1rem;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background:
            radial-gradient(2px 2px at 20% 20%, #00d4ff, transparent),
            radial-gradient(2px 2px at 40% 40%, #ff4444, transparent),
            radial-gradient(1px 1px at 60% 60%, #00ff88, transparent),
            radial-gradient(1px 1px at 80% 80%, #ffaa00, transparent),
            radial-gradient(2px 2px at 30% 70%, #ff4444, transparent);
        animation: threatPulse 3s ease-in-out infinite;
    }

    @keyframes threatPulse {
        0%,
        100% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
    }
`;

const ActivityFeed = styled.div`
    max-height: 300px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: #1a1a1a;
    }

    &::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 2px;
    }
`;

const ActivityItem = styled.div`
    padding: 0.75rem 0;
    border-bottom: 1px solid #333;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;

    &:last-child {
        border-bottom: none;
    }
`;

const ActivityIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.color || '#333'};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const ActivityContent = styled.div`
    flex: 1;
`;

const ActivityText = styled.div`
    color: #ccc;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
    color: #666;
    font-size: 0.8rem;
`;

const DashboardPage = () => {
    const [metrics, setMetrics] = useState({
        activeThrents: 127,
        criticalAlerts: 23,
        feedsOnline: 8,
        avgResponse: 4.2,
    });

    const [activities] = useState([
        {
            id: 1,
            type: 'threat',
            text: 'New malware signature detected',
            time: '2 minutes ago',
            color: '#ff4444',
        },
        {
            id: 2,
            type: 'feed',
            text: 'ThreatConnect feed updated',
            time: '5 minutes ago',
            color: '#00d4ff',
        },
        {
            id: 3,
            type: 'alert',
            text: 'Suspicious login from Russia',
            time: '8 minutes ago',
            color: '#ffaa00',
        },
        {
            id: 4,
            type: 'system',
            text: 'Anomaly detection model retrained',
            time: '15 minutes ago',
            color: '#00ff88',
        },
        {
            id: 5,
            type: 'threat',
            text: 'C2 server communication blocked',
            time: '18 minutes ago',
            color: '#ff4444',
        },
    ]);

    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            setMetrics((prev) => ({
                ...prev,
                activeThrents: prev.activeThrents + Math.floor(Math.random() * 3) - 1,
                criticalAlerts: prev.criticalAlerts + Math.floor(Math.random() * 2),
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardContainer>
            <PageHeader>
                <Title>🏠 Threat Overview Dashboard</Title>
                <Subtitle>Real-time cyber threat intelligence and operational snapshot</Subtitle>
            </PageHeader>

            <MetricsGrid>
                <MetricCard color="#00d4ff">
                    <MetricValue color="#00d4ff">{metrics.activeThrents}</MetricValue>
                    <MetricLabel>Active Threats</MetricLabel>
                    <MetricChange positive={false}>↑ +3 from last hour</MetricChange>
                </MetricCard>

                <MetricCard color="#ff4444">
                    <MetricValue color="#ff4444">{metrics.criticalAlerts}</MetricValue>
                    <MetricLabel>Critical Alerts</MetricLabel>
                    <MetricChange positive={false}>↑ +5 from yesterday</MetricChange>
                </MetricCard>

                <MetricCard color="#00ff88">
                    <MetricValue color="#00ff88">{metrics.feedsOnline}/9</MetricValue>
                    <MetricLabel>Intelligence Feeds</MetricLabel>
                    <MetricChange positive={true}>↑ 1 feed restored</MetricChange>
                </MetricCard>

                <MetricCard color="#ffaa00">
                    <MetricValue color="#ffaa00">{metrics.avgResponse}m</MetricValue>
                    <MetricLabel>Avg Response Time</MetricLabel>
                    <MetricChange positive={true}>↓ -0.8m improvement</MetricChange>
                </MetricCard>
            </MetricsGrid>

            <ChartsGrid>
                <ChartPanel>
                    <ChartTitle>🌍 Global Threat Map</ChartTitle>
                    <ThreatMap>
                        <div>Real-time threat geolocation visualization</div>
                    </ThreatMap>
                </ChartPanel>

                <ChartPanel>
                    <ChartTitle>📡 Recent Activity</ChartTitle>
                    <ActivityFeed>
                        {activities.map((activity) => (
                            <ActivityItem key={activity.id}>
                                <ActivityIcon color={activity.color}>
                                    {activity.type === 'threat'
                                        ? '🛡️'
                                        : activity.type === 'feed'
                                          ? '📡'
                                          : activity.type === 'alert'
                                            ? '🚨'
                                            : '⚙️'}
                                </ActivityIcon>
                                <ActivityContent>
                                    <ActivityText>{activity.text}</ActivityText>
                                    <ActivityTime>{activity.time}</ActivityTime>
                                </ActivityContent>
                            </ActivityItem>
                        ))}
                    </ActivityFeed>
                </ChartPanel>
            </ChartsGrid>
        </DashboardContainer>
    );
};

export default DashboardPage;
