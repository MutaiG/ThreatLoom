import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import threatLoomAPI from '../services/apiService';

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

const OverviewGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const OverviewCard = styled.div`
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

const OverviewValue = styled.div`
    font-size: 2.5rem;
    font-weight: 700;
    color: ${(props) => props.color || '#00d4ff'};
    margin-bottom: 0.5rem;
`;

const OverviewLabel = styled.div`
    color: #ccc;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
`;

const OverviewTrend = styled.div`
    font-size: 0.8rem;
    color: ${(props) => (props.positive ? '#00ff88' : '#ff4444')};
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const FeedsContainer = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    overflow: hidden;
`;

const FeedsHeader = styled.div`
    background: #222;
    border-bottom: 1px solid #333;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const FeedsTitle = styled.h3`
    color: #00d4ff;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
`;

const RefreshButton = styled.button`
    background: linear-gradient(45deg, #00d4ff, #0099cc);
    border: none;
    border-radius: 6px;
    color: #000;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
    }
`;

const FeedsList = styled.div`
    display: flex;
    flex-direction: column;
`;

const FeedItem = styled.div`
    padding: 1.5rem;
    border-bottom: 1px solid #333;
    transition: background 0.2s;

    &:hover {
        background: rgba(0, 212, 255, 0.05);
    }

    &:last-child {
        border-bottom: none;
    }
`;

const FeedHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
`;

const FeedInfo = styled.div`
    flex: 1;
`;

const FeedName = styled.h4`
    color: #fff;
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
`;

const FeedType = styled.span`
    background: rgba(0, 212, 255, 0.2);
    border: 1px solid #00d4ff;
    color: #00d4ff;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
`;

const FeedStatus = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const StatusIndicator = styled.div`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${(props) => {
        switch (props.status) {
            case 'Active':
                return '#00ff88';
            case 'Warning':
                return '#ffaa00';
            case 'Error':
                return '#ff4444';
            default:
                return '#666';
        }
    }};
`;

const StatusText = styled.span`
    color: ${(props) => {
        switch (props.status) {
            case 'Active':
                return '#00ff88';
            case 'Warning':
                return '#ffaa00';
            case 'Error':
                return '#ff4444';
            default:
                return '#666';
        }
    }};
    font-weight: 600;
    font-size: 0.9rem;
`;

const FeedMetrics = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
`;

const MetricItem = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
`;

const MetricValue = styled.div`
    color: #00d4ff;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
    color: #999;
    font-size: 0.8rem;
`;

const LastUpdateInfo = styled.div`
    color: #999;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const QualityBar = styled.div`
    width: 60px;
    height: 8px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: ${(props) => props.quality}%;
        background: ${(props) =>
            props.quality > 90 ? '#00ff88' : props.quality > 70 ? '#ffaa00' : '#ff4444'};
        border-radius: 4px;
    }
`;

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #00d4ff;
    font-size: 1.1rem;
`;

const IntelligenceFeedsPage = () => {
    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadFeeds();
    }, []);

    const loadFeeds = async () => {
        try {
            setLoading(true);
            const data = await threatLoomAPI.getIntelligenceFeeds();
            setFeeds(data);
        } catch (error) {
            console.error('Failed to load intelligence feeds:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadFeeds();
        setRefreshing(false);
    };

    const getOverviewStats = () => {
        const total = feeds.length;
        const active = feeds.filter((f) => f.status === 'Active').length;
        const totalRecords = feeds.reduce((sum, f) => sum + f.recordCount, 0);
        const avgQuality = Math.round(
            feeds.reduce((sum, f) => sum + f.quality, 0) / feeds.length || 0,
        );

        return { total, active, totalRecords, avgQuality };
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
        return `${Math.floor(diffMinutes / 1440)}d ago`;
    };

    if (loading) {
        return (
            <PageContainer>
                <LoadingSpinner>Loading intelligence feeds...</LoadingSpinner>
            </PageContainer>
        );
    }

    const stats = getOverviewStats();

    return (
        <PageContainer>
            <PageHeader>
                <Title>📡 Intelligence Feeds</Title>
                <Subtitle>Multiple feed format support and health monitoring</Subtitle>
            </PageHeader>

            <OverviewGrid>
                <OverviewCard color="#00d4ff">
                    <OverviewValue color="#00d4ff">{stats.total}</OverviewValue>
                    <OverviewLabel>Total Feeds</OverviewLabel>
                    <OverviewTrend positive={true}>↑ All sources configured</OverviewTrend>
                </OverviewCard>

                <OverviewCard color="#00ff88">
                    <OverviewValue color="#00ff88">{stats.active}</OverviewValue>
                    <OverviewLabel>Active Feeds</OverviewLabel>
                    <OverviewTrend positive={true}>
                        ↑ {Math.round((stats.active / stats.total) * 100)}% uptime
                    </OverviewTrend>
                </OverviewCard>

                <OverviewCard color="#ffaa00">
                    <OverviewValue color="#ffaa00">
                        {formatNumber(stats.totalRecords)}
                    </OverviewValue>
                    <OverviewLabel>Total Records</OverviewLabel>
                    <OverviewTrend positive={true}>↑ Growing dataset</OverviewTrend>
                </OverviewCard>

                <OverviewCard color="#ff8800">
                    <OverviewValue color="#ff8800">{stats.avgQuality}%</OverviewValue>
                    <OverviewLabel>Avg Quality Score</OverviewLabel>
                    <OverviewTrend positive={true}>↑ High confidence</OverviewTrend>
                </OverviewCard>
            </OverviewGrid>

            <FeedsContainer>
                <FeedsHeader>
                    <FeedsTitle>Intelligence Feed Status</FeedsTitle>
                    <RefreshButton onClick={handleRefresh} disabled={refreshing}>
                        {refreshing ? '🔄 Refreshing...' : '🔄 Refresh All'}
                    </RefreshButton>
                </FeedsHeader>

                <FeedsList>
                    {feeds.map((feed) => (
                        <FeedItem key={feed.id}>
                            <FeedHeader>
                                <FeedInfo>
                                    <FeedName>{feed.name}</FeedName>
                                    <FeedType>{feed.type}</FeedType>
                                </FeedInfo>
                                <FeedStatus>
                                    <StatusIndicator status={feed.status} />
                                    <StatusText status={feed.status}>{feed.status}</StatusText>
                                </FeedStatus>
                            </FeedHeader>

                            <FeedMetrics>
                                <MetricItem>
                                    <MetricValue>{formatNumber(feed.recordCount)}</MetricValue>
                                    <MetricLabel>Records</MetricLabel>
                                </MetricItem>

                                <MetricItem>
                                    <MetricValue>
                                        <QualityBar quality={feed.quality} />
                                        <span style={{ marginLeft: '0.5rem' }}>
                                            {feed.quality}%
                                        </span>
                                    </MetricValue>
                                    <MetricLabel>Quality Score</MetricLabel>
                                </MetricItem>

                                <MetricItem>
                                    <MetricValue>{feed.latency}</MetricValue>
                                    <MetricLabel>Latency</MetricLabel>
                                </MetricItem>

                                <MetricItem>
                                    <MetricValue>{feed.format}</MetricValue>
                                    <MetricLabel>Format</MetricLabel>
                                </MetricItem>
                            </FeedMetrics>

                            <LastUpdateInfo>
                                <span>📅</span>
                                Last updated: {formatTimeAgo(feed.lastUpdate)}
                            </LastUpdateInfo>
                        </FeedItem>
                    ))}
                </FeedsList>
            </FeedsContainer>
        </PageContainer>
    );
};

export default IntelligenceFeedsPage;
