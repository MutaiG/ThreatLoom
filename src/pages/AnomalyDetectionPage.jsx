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

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

const MetricTrend = styled.div`
    font-size: 0.8rem;
    color: ${(props) => {
        switch (props.trend) {
            case 'up':
                return '#ff4444';
            case 'down':
                return '#00ff88';
            default:
                return '#ffaa00';
        }
    }};
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const ChartsSection = styled.div`
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

const TimeSeriesChart = styled.div`
    height: 250px;
    background: #0a0a0a;
    border: 1px solid #333;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: end;
    padding: 1rem;
    gap: 2px;
`;

const ChartBar = styled.div`
    flex: 1;
    background: linear-gradient(to top, #00d4ff, #0099cc);
    border-radius: 2px 2px 0 0;
    height: ${(props) => props.height}%;
    min-height: 2px;
    transition: height 0.3s ease;
    opacity: 0.8;

    &:hover {
        opacity: 1;
    }
`;

const CategoryList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const CategoryItem = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CategoryInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const CategoryName = styled.div`
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
`;

const CategoryCount = styled.div`
    color: #999;
    font-size: 0.8rem;
`;

const CategoryMetrics = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
`;

const SeverityBadge = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== 'severity',
})`
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    background: ${(props) => {
        switch (props.severity) {
            case 'high':
                return '#ff4444';
            case 'medium':
                return '#ffaa00';
            case 'low':
                return '#00ff88';
            default:
                return '#666';
        }
    }};
    color: ${(props) => (props.severity === 'low' ? '#000' : '#fff')};
`;

const AnomalyTable = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    overflow: hidden;
`;

const TableHeader = styled.div`
    background: #222;
    border-bottom: 1px solid #333;
    padding: 1rem;
`;

const TableTitle = styled.h3`
    color: #00d4ff;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
`;

const Table = styled.div`
    max-height: 400px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #1a1a1a;
    }

    &::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 4px;
    }
`;

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 120px 1fr 100px 120px 100px 150px;
    padding: 1rem;
    border-bottom: 1px solid #333;
    transition: background 0.2s;

    &:hover {
        background: rgba(0, 212, 255, 0.05);
    }

    &:last-child {
        border-bottom: none;
    }
`;

const TableCell = styled.div`
    color: #ccc;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
`;

const ScoreBar = styled.div`
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
        width: ${(props) => props.score * 100}%;
        background: ${(props) =>
            props.score > 0.7 ? '#ff4444' : props.score > 0.5 ? '#ffaa00' : '#00ff88'};
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

const AnomalyDetectionPage = () => {
    const [anomalyData, setAnomalyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnomalyData();
    }, []);

    const loadAnomalyData = async () => {
        try {
            setLoading(true);
            const data = await threatLoomAPI.getAnomalies();
            setAnomalyData(data);
        } catch (error) {
            console.error('Failed to load anomaly data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <LoadingSpinner>Loading anomaly detection data...</LoadingSpinner>
            </PageContainer>
        );
    }

    const { summary, categories, recentAnomalies, timeSeries } = anomalyData;

    return (
        <PageContainer>
            <PageHeader>
                <Title>🔍 Anomaly Detection</Title>
                <Subtitle>Behavioral analysis and suspicious activity detection</Subtitle>
            </PageHeader>

            <MetricsGrid>
                <MetricCard color="#00d4ff">
                    <MetricValue color="#00d4ff">{summary.totalAnomalies}</MetricValue>
                    <MetricLabel>Total Anomalies</MetricLabel>
                    <MetricTrend trend="up">↑ {summary.newToday} new today</MetricTrend>
                </MetricCard>

                <MetricCard color="#ff4444">
                    <MetricValue color="#ff4444">{summary.criticalAnomalies}</MetricValue>
                    <MetricLabel>Critical Anomalies</MetricLabel>
                    <MetricTrend trend="up">↑ Requires attention</MetricTrend>
                </MetricCard>

                <MetricCard color="#ffaa00">
                    <MetricValue color="#ffaa00">{summary.falsePositiveRate}%</MetricValue>
                    <MetricLabel>False Positive Rate</MetricLabel>
                    <MetricTrend trend="down">↓ Improving accuracy</MetricTrend>
                </MetricCard>

                <MetricCard color="#00ff88">
                    <MetricValue color="#00ff88">94%</MetricValue>
                    <MetricLabel>Model Accuracy</MetricLabel>
                    <MetricTrend trend="stable">→ Stable performance</MetricTrend>
                </MetricCard>
            </MetricsGrid>

            <ChartsSection>
                <ChartPanel>
                    <ChartTitle>📈 Anomaly Detection Timeline (24h)</ChartTitle>
                    <TimeSeriesChart>
                        {timeSeries.map((point, index) => (
                            <ChartBar
                                key={index}
                                height={
                                    (point.value / Math.max(...timeSeries.map((p) => p.value))) *
                                    100
                                }
                                title={`${point.value} anomalies at ${new Date(point.timestamp).toLocaleTimeString()}`}
                            />
                        ))}
                    </TimeSeriesChart>
                </ChartPanel>

                <ChartPanel>
                    <ChartTitle>📋 Anomaly Categories</ChartTitle>
                    <CategoryList>
                        {categories.map((category, index) => (
                            <CategoryItem key={index}>
                                <CategoryInfo>
                                    <CategoryName>{category.name}</CategoryName>
                                    <CategoryCount>{category.count} detections</CategoryCount>
                                </CategoryInfo>
                                <CategoryMetrics>
                                    <SeverityBadge severity={category.severity}>
                                        {category.severity}
                                    </SeverityBadge>
                                    <MetricTrend trend={category.trend}>
                                        {category.trend === 'up'
                                            ? '↑'
                                            : category.trend === 'down'
                                              ? '↓'
                                              : '→'}
                                        {category.trend}
                                    </MetricTrend>
                                </CategoryMetrics>
                            </CategoryItem>
                        ))}
                    </CategoryList>
                </ChartPanel>
            </ChartsSection>

            <AnomalyTable>
                <TableHeader>
                    <TableTitle>Recent Anomalies</TableTitle>
                </TableHeader>

                <Table>
                    {recentAnomalies.slice(0, 20).map((anomaly) => (
                        <TableRow key={anomaly.id}>
                            <TableCell>{anomaly.type}</TableCell>
                            <TableCell>{anomaly.description}</TableCell>
                            <TableCell>
                                <SeverityBadge severity={anomaly.severity.toLowerCase()}>
                                    {anomaly.severity}
                                </SeverityBadge>
                            </TableCell>
                            <TableCell>
                                {new Date(anomaly.timestamp).toLocaleTimeString()}
                            </TableCell>
                            <TableCell>
                                <ScoreBar score={parseFloat(anomaly.score)} />
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                                    {anomaly.score}
                                </span>
                            </TableCell>
                            <TableCell>{anomaly.source}</TableCell>
                        </TableRow>
                    ))}
                </Table>
            </AnomalyTable>
        </PageContainer>
    );
};

export default AnomalyDetectionPage;
