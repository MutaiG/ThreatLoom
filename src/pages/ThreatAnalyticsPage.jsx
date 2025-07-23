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

const AnalyticsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const AnalyticsPanel = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
`;

const PanelTitle = styled.h3`
    color: #00d4ff;
    margin: 0 0 1.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
`;

const ThreatActorsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ThreatActorItem = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ActorInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const ActorName = styled.div`
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
`;

const ActorMeta = styled.div`
    color: #999;
    font-size: 0.8rem;
`;

const ActorMetrics = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
`;

const CampaignCount = styled.div`
    color: #00d4ff;
    font-weight: 600;
    font-size: 1.2rem;
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
            case 'Critical':
                return '#ff4444';
            case 'High':
                return '#ff8800';
            case 'Medium':
                return '#ffaa00';
            default:
                return '#666';
        }
    }};
    color: #fff;
`;

const AttackVectorChart = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const VectorItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const VectorLabel = styled.div`
    color: #ccc;
    font-size: 0.9rem;
    width: 120px;
`;

const VectorBar = styled.div`
    flex: 1;
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
        width: ${(props) => props.percentage}%;
        background: linear-gradient(90deg, #00d4ff, #0099cc);
        border-radius: 4px;
    }
`;

const VectorStats = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 80px;
`;

const Percentage = styled.span`
    color: #00d4ff;
    font-weight: 600;
    font-size: 0.9rem;
`;

const TrendIcon = styled.span`
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
    font-size: 0.8rem;
`;

const IndustryTargetsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
`;

const IndustryCard = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
`;

const IndustryName = styled.div`
    color: #fff;
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

const IndustryAttacks = styled.div`
    color: #00d4ff;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
`;

const IndustryPercentage = styled.div`
    color: #999;
    font-size: 0.8rem;
`;

const MitreHeatmap = styled.div`
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
`;

const HeatmapGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
`;

const TacticCard = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
`;

const TacticName = styled.div`
    color: #fff;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 0.9rem;
`;

const TacticMetrics = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
`;

const MetricLabel = styled.span`
    color: #999;
    font-size: 0.8rem;
`;

const MetricValue = styled.span`
    color: #00d4ff;
    font-weight: 600;
`;

const CoverageBar = styled.div`
    width: 100%;
    height: 6px;
    background: #333;
    border-radius: 3px;
    overflow: hidden;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: ${(props) => props.coverage}%;
        background: ${(props) =>
            props.coverage > 80 ? '#00ff88' : props.coverage > 50 ? '#ffaa00' : '#ff4444'};
        border-radius: 3px;
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

const ThreatAnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalyticsData();
    }, []);

    const loadAnalyticsData = async () => {
        try {
            setLoading(true);
            const data = await threatLoomAPI.getThreatAnalytics();
            setAnalyticsData(data);
        } catch (error) {
            console.error('Failed to load threat analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <LoadingSpinner>Loading threat analytics...</LoadingSpinner>
            </PageContainer>
        );
    }

    const { threatActors, attackVectors, industryTargets, mitreTactics } = analyticsData;

    return (
        <PageContainer>
            <PageHeader>
                <Title>📊 Threat Analytics</Title>
                <Subtitle>Data-rich correlations and trend exploration</Subtitle>
            </PageHeader>

            <AnalyticsGrid>
                <AnalyticsPanel>
                    <PanelTitle>🎭 Active Threat Actors</PanelTitle>
                    <ThreatActorsList>
                        {threatActors.map((actor, index) => (
                            <ThreatActorItem key={index}>
                                <ActorInfo>
                                    <ActorName>{actor.name}</ActorName>
                                    <ActorMeta>Last seen: {actor.lastSeen}</ActorMeta>
                                </ActorInfo>
                                <ActorMetrics>
                                    <CampaignCount>{actor.campaigns} campaigns</CampaignCount>
                                    <SeverityBadge severity={actor.severity}>
                                        {actor.severity}
                                    </SeverityBadge>
                                </ActorMetrics>
                            </ThreatActorItem>
                        ))}
                    </ThreatActorsList>
                </AnalyticsPanel>

                <AnalyticsPanel>
                    <PanelTitle>🎯 Attack Vector Distribution</PanelTitle>
                    <AttackVectorChart>
                        {attackVectors.map((vector, index) => (
                            <VectorItem key={index}>
                                <VectorLabel>{vector.vector}</VectorLabel>
                                <VectorBar percentage={vector.percentage} />
                                <VectorStats>
                                    <Percentage>{vector.percentage}%</Percentage>
                                    <TrendIcon trend={vector.trend}>
                                        {vector.trend === 'up'
                                            ? '↑'
                                            : vector.trend === 'down'
                                              ? '↓'
                                              : '→'}
                                    </TrendIcon>
                                </VectorStats>
                            </VectorItem>
                        ))}
                    </AttackVectorChart>
                </AnalyticsPanel>
            </AnalyticsGrid>

            <AnalyticsPanel style={{ marginBottom: '2rem' }}>
                <PanelTitle>🏢 Industry Targeting Trends</PanelTitle>
                <IndustryTargetsGrid>
                    {industryTargets.map((industry, index) => (
                        <IndustryCard key={index}>
                            <IndustryName>{industry.industry}</IndustryName>
                            <IndustryAttacks>{industry.attacks}</IndustryAttacks>
                            <IndustryPercentage>{industry.percentage}% of total</IndustryPercentage>
                        </IndustryCard>
                    ))}
                </IndustryTargetsGrid>
            </AnalyticsPanel>

            <MitreHeatmap>
                <PanelTitle>🛡️ MITRE ATT&CK Coverage Heatmap</PanelTitle>
                <HeatmapGrid>
                    {mitreTactics.map((tactic, index) => (
                        <TacticCard key={index}>
                            <TacticName>{tactic.tactic}</TacticName>

                            <TacticMetrics>
                                <MetricLabel>Techniques</MetricLabel>
                                <MetricValue>{tactic.techniques}</MetricValue>
                            </TacticMetrics>

                            <TacticMetrics>
                                <MetricLabel>Detections</MetricLabel>
                                <MetricValue>{tactic.detections}</MetricValue>
                            </TacticMetrics>

                            <TacticMetrics style={{ marginBottom: '1rem' }}>
                                <MetricLabel>Coverage</MetricLabel>
                                <MetricValue>{tactic.coverage}%</MetricValue>
                            </TacticMetrics>

                            <CoverageBar coverage={tactic.coverage} />
                        </TacticCard>
                    ))}
                </HeatmapGrid>
            </MitreHeatmap>
        </PageContainer>
    );
};

export default ThreatAnalyticsPage;
