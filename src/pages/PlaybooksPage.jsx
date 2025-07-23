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

const CategoryTabs = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
`;

const CategoryTab = styled.button.withConfig({
    shouldForwardProp: (prop) => prop !== 'active',
})`
    background: ${(props) => (props.active ? '#00d4ff' : 'transparent')};
    border: 1px solid ${(props) => (props.active ? '#00d4ff' : '#333')};
    border-radius: 8px;
    color: ${(props) => (props.active ? '#000' : '#ccc')};
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${(props) => (props.active ? '#00d4ff' : 'rgba(0, 212, 255, 0.1)')};
        color: ${(props) => (props.active ? '#000' : '#00d4ff')};
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const StatCard = styled.div`
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

const StatValue = styled.div`
    font-size: 2.5rem;
    font-weight: 700;
    color: ${(props) => props.color || '#00d4ff'};
    margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
    color: #ccc;
    font-size: 0.9rem;
`;

const PlaybooksGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
`;

const PlaybookCard = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'automated',
})`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        border-color: #00d4ff;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 212, 255, 0.15);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: ${(props) => (props.automated ? '#00ff88' : '#ffaa00')};
    }
`;

const PlaybookHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
`;

const PlaybookTitle = styled.h3`
    color: #fff;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    flex: 1;
`;

const AutomationBadge = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== 'automated',
})`
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    background: ${(props) => (props.automated ? '#00ff88' : '#ffaa00')};
    color: ${(props) => (props.automated ? '#000' : '#fff')};
`;

const PlaybookCategory = styled.div`
    color: #00d4ff;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 1rem;
`;

const PlaybookMetrics = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const MetricItem = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 0.75rem;
    text-align: center;
`;

const MetricValue = styled.div`
    color: #00d4ff;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
    color: #999;
    font-size: 0.8rem;
`;

const PlaybookFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #333;
`;

const LastUsed = styled.div`
    color: #999;
    font-size: 0.8rem;
`;

const UsageCount = styled.div`
    color: #00d4ff;
    font-size: 0.9rem;
    font-weight: 600;
`;

const CreatePlaybookButton = styled.button`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: linear-gradient(45deg, #00d4ff, #0099cc);
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    color: #000;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
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

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem;
    color: #666;
`;

const PlaybooksPage = () => {
    const [playbooks, setPlaybooks] = useState([]);
    const [filteredPlaybooks, setFilteredPlaybooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        'all',
        'Incident Response',
        'Email Security',
        'Threat Intelligence',
        'Network Security',
    ];

    useEffect(() => {
        loadPlaybooks();
    }, []);

    useEffect(() => {
        filterPlaybooks();
    }, [playbooks, activeCategory]);

    const loadPlaybooks = async () => {
        try {
            setLoading(true);
            const data = await threatLoomAPI.getPlaybooks();
            setPlaybooks(data);
        } catch (error) {
            console.error('Failed to load playbooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterPlaybooks = () => {
        if (activeCategory === 'all') {
            setFilteredPlaybooks(playbooks);
        } else {
            setFilteredPlaybooks(
                playbooks.filter((playbook) => playbook.category === activeCategory),
            );
        }
    };

    const getStats = () => {
        const total = playbooks.length;
        const automated = playbooks.filter((p) => p.automationReady).length;
        const avgSteps = Math.round(
            playbooks.reduce((sum, p) => sum + p.steps, 0) / playbooks.length || 0,
        );
        const totalUsage = playbooks.reduce((sum, p) => sum + p.usage, 0);

        return { total, automated, avgSteps, totalUsage };
    };

    const formatDuration = (duration) => {
        return duration;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    if (loading) {
        return (
            <PageContainer>
                <LoadingSpinner>Loading playbooks...</LoadingSpinner>
            </PageContainer>
        );
    }

    const stats = getStats();

    return (
        <PageContainer>
            <PageHeader>
                <Title>📋 Playbooks</Title>
                <Subtitle>
                    Standard Operating Procedures and guided investigation templates
                </Subtitle>
            </PageHeader>

            <StatsGrid>
                <StatCard color="#00d4ff">
                    <StatValue color="#00d4ff">{stats.total}</StatValue>
                    <StatLabel>Total Playbooks</StatLabel>
                </StatCard>
                <StatCard color="#00ff88">
                    <StatValue color="#00ff88">{stats.automated}</StatValue>
                    <StatLabel>Automation Ready</StatLabel>
                </StatCard>
                <StatCard color="#ffaa00">
                    <StatValue color="#ffaa00">{stats.avgSteps}</StatValue>
                    <StatLabel>Avg Steps</StatLabel>
                </StatCard>
                <StatCard color="#ff8800">
                    <StatValue color="#ff8800">{stats.totalUsage}</StatValue>
                    <StatLabel>Total Executions</StatLabel>
                </StatCard>
            </StatsGrid>

            <CategoryTabs>
                {categories.map((category) => (
                    <CategoryTab
                        key={category}
                        active={activeCategory === category}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category === 'all' ? 'All Categories' : category}
                    </CategoryTab>
                ))}
            </CategoryTabs>

            {filteredPlaybooks.length === 0 ? (
                <EmptyState>
                    <h3>No playbooks found</h3>
                    <p>Create your first playbook to get started</p>
                </EmptyState>
            ) : (
                <PlaybooksGrid>
                    {filteredPlaybooks.map((playbook) => (
                        <PlaybookCard key={playbook.id} automated={playbook.automationReady}>
                            <PlaybookHeader>
                                <PlaybookTitle>{playbook.title}</PlaybookTitle>
                                <AutomationBadge automated={playbook.automationReady}>
                                    {playbook.automationReady ? '🤖 Automated' : '👤 Manual'}
                                </AutomationBadge>
                            </PlaybookHeader>

                            <PlaybookCategory>{playbook.category}</PlaybookCategory>

                            <PlaybookMetrics>
                                <MetricItem>
                                    <MetricValue>{playbook.steps}</MetricValue>
                                    <MetricLabel>Steps</MetricLabel>
                                </MetricItem>
                                <MetricItem>
                                    <MetricValue>
                                        {formatDuration(playbook.avgDuration)}
                                    </MetricValue>
                                    <MetricLabel>Avg Duration</MetricLabel>
                                </MetricItem>
                            </PlaybookMetrics>

                            <PlaybookFooter>
                                <LastUsed>Last used: {formatDate(playbook.lastUsed)}</LastUsed>
                                <UsageCount>{playbook.usage} times used</UsageCount>
                            </PlaybookFooter>
                        </PlaybookCard>
                    ))}
                </PlaybooksGrid>
            )}

            <CreatePlaybookButton title="Create New Playbook">+</CreatePlaybookButton>
        </PageContainer>
    );
};

export default PlaybooksPage;
