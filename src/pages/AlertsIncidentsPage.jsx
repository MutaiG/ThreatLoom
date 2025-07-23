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

const FilterTabs = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
`;

const FilterTab = styled.button.withConfig({
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

const AlertsContainer = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    overflow: hidden;
`;

const AlertsHeader = styled.div`
    background: #222;
    border-bottom: 1px solid #333;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AlertsTitle = styled.h3`
    color: #00d4ff;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
`;

const SearchBar = styled.input`
    background: #333;
    border: 1px solid #555;
    border-radius: 6px;
    color: #fff;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    width: 300px;

    &:focus {
        outline: none;
        border-color: #00d4ff;
    }

    &::placeholder {
        color: #999;
    }
`;

const AlertsList = styled.div`
    max-height: 600px;
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

const AlertItem = styled.div`
    padding: 1.5rem;
    border-bottom: 1px solid #333;
    transition: background 0.2s;
    cursor: pointer;

    &:hover {
        background: rgba(0, 212, 255, 0.05);
    }

    &:last-child {
        border-bottom: none;
    }
`;

const AlertHeader = styled.div`
    display: flex;
    justify-content: between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
`;

const AlertTitle = styled.h4`
    color: #fff;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    flex: 1;
`;

const AlertMeta = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const SeverityBadge = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== 'severity',
})`
    padding: 0.25rem 0.75rem;
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
            case 'Low':
                return '#00ff88';
            default:
                return '#666';
        }
    }};
    color: ${(props) => (props.severity === 'Low' ? '#000' : '#fff')};
`;

const StatusBadge = styled.span`
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    background: ${(props) => {
        switch (props.status) {
            case 'Open':
                return '#ff4444';
            case 'Investigating':
                return '#ffaa00';
            case 'Resolved':
                return '#00ff88';
            case 'False Positive':
                return '#666';
            default:
                return '#333';
        }
    }};
    color: ${(props) => (props.status === 'Resolved' ? '#000' : '#fff')};
`;

const AlertDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const AlertInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const AlertMetaItem = styled.div`
    color: #999;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const MitreTags = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
`;

const MitreTag = styled.span`
    background: rgba(0, 212, 255, 0.2);
    border: 1px solid #00d4ff;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: #00d4ff;
`;

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #00d4ff;
    font-size: 1.1rem;
`;

const AlertsIncidentsPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadAlerts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [alerts, activeFilter, searchTerm]);

    const loadAlerts = async () => {
        try {
            setLoading(true);
            const data = await threatLoomAPI.getAlerts();
            setAlerts(data);
        } catch (error) {
            console.error('Failed to load alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...alerts];

        if (activeFilter !== 'all') {
            filtered = filtered.filter((alert) => alert.status.toLowerCase() === activeFilter);
        }

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (alert) =>
                    alert.title.toLowerCase().includes(search) ||
                    alert.assignee.toLowerCase().includes(search),
            );
        }

        setFilteredAlerts(filtered);
    };

    const getStats = () => {
        const total = alerts.length;
        const open = alerts.filter((a) => a.status === 'Open').length;
        const critical = alerts.filter((a) => a.severity === 'Critical').length;
        const investigating = alerts.filter((a) => a.status === 'Investigating').length;

        return { total, open, critical, investigating };
    };

    const stats = getStats();

    if (loading) {
        return (
            <PageContainer>
                <LoadingSpinner>Loading alerts and incidents...</LoadingSpinner>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <Title>🚨 Alerts & Incidents</Title>
                <Subtitle>Alert queue management with triage workflows</Subtitle>
            </PageHeader>

            <StatsGrid>
                <StatCard color="#00d4ff">
                    <StatValue color="#00d4ff">{stats.total}</StatValue>
                    <StatLabel>Total Alerts</StatLabel>
                </StatCard>
                <StatCard color="#ff4444">
                    <StatValue color="#ff4444">{stats.open}</StatValue>
                    <StatLabel>Open Alerts</StatLabel>
                </StatCard>
                <StatCard color="#ff8800">
                    <StatValue color="#ff8800">{stats.critical}</StatValue>
                    <StatLabel>Critical Severity</StatLabel>
                </StatCard>
                <StatCard color="#ffaa00">
                    <StatValue color="#ffaa00">{stats.investigating}</StatValue>
                    <StatLabel>Under Investigation</StatLabel>
                </StatCard>
            </StatsGrid>

            <FilterTabs>
                {['all', 'open', 'investigating', 'resolved'].map((filter) => (
                    <FilterTab
                        key={filter}
                        active={activeFilter === filter}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </FilterTab>
                ))}
            </FilterTabs>

            <AlertsContainer>
                <AlertsHeader>
                    <AlertsTitle>Security Alerts ({filteredAlerts.length})</AlertsTitle>
                    <SearchBar
                        placeholder="Search alerts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </AlertsHeader>

                <AlertsList>
                    {filteredAlerts.slice(0, 50).map((alert) => (
                        <AlertItem key={alert.id}>
                            <AlertHeader>
                                <AlertTitle>{alert.title}</AlertTitle>
                                <AlertMeta>
                                    <SeverityBadge severity={alert.severity}>
                                        {alert.severity}
                                    </SeverityBadge>
                                    <StatusBadge status={alert.status}>{alert.status}</StatusBadge>
                                </AlertMeta>
                            </AlertHeader>

                            <AlertDetails>
                                <AlertInfo>
                                    <AlertMetaItem>
                                        <span>📅</span>
                                        Created: {new Date(alert.created).toLocaleString()}
                                    </AlertMetaItem>
                                    <AlertMetaItem>
                                        <span>👤</span>
                                        Assigned: {alert.assignee}
                                    </AlertMetaItem>
                                    <AlertMetaItem>
                                        <span>🖥️</span>
                                        Affected Systems: {alert.affectedSystems}
                                    </AlertMetaItem>
                                    <AlertMetaItem>
                                        <span>📡</span>
                                        Source: {alert.source}
                                    </AlertMetaItem>
                                </AlertInfo>
                            </AlertDetails>

                            {alert.mitreTactics && alert.mitreTactics.length > 0 && (
                                <MitreTags>
                                    {alert.mitreTactics.map((tactic, index) => (
                                        <MitreTag key={index}>{tactic}</MitreTag>
                                    ))}
                                </MitreTags>
                            )}
                        </AlertItem>
                    ))}
                </AlertsList>
            </AlertsContainer>
        </PageContainer>
    );
};

export default AlertsIncidentsPage;
