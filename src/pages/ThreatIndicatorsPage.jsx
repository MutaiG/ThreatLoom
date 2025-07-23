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

const FilterBar = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
`;

const FilterGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const FilterLabel = styled.label`
    color: #ccc;
    font-size: 0.9rem;
    font-weight: 500;
`;

const FilterSelect = styled.select`
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

const SearchInput = styled.input`
    background: #333;
    border: 1px solid #555;
    border-radius: 6px;
    color: #fff;
    padding: 0.5rem;
    font-size: 0.9rem;
    min-width: 200px;

    &:focus {
        outline: none;
        border-color: #00d4ff;
    }

    &::placeholder {
        color: #999;
    }
`;

const StatsBar = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
`;

const StatCard = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
`;

const StatValue = styled.div`
    font-size: 1.8rem;
    font-weight: 700;
    color: ${(props) => props.color || '#00d4ff'};
    margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
    color: #999;
    font-size: 0.9rem;
`;

const TableContainer = styled.div`
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid #333;
    border-radius: 12px;
    overflow: hidden;
`;

const TableHeader = styled.div`
    background: #222;
    border-bottom: 1px solid #333;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TableTitle = styled.h3`
    color: #00d4ff;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
`;

const Table = styled.div`
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

const TableHeaderRow = styled.div`
    display: grid;
    grid-template-columns: 100px 1fr 100px 120px 120px 100px 150px;
    background: #2a2a2a;
    padding: 1rem;
    border-bottom: 1px solid #333;
    font-weight: 600;
    color: #ccc;
    font-size: 0.9rem;
`;

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 100px 1fr 100px 120px 120px 100px 150px;
    padding: 1rem;
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

const TableCell = styled.div`
    color: #ccc;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const IOCValue = styled.div`
    font-family: 'Courier New', monospace;
    background: #333;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
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
            case 'Low':
                return '#00ff88';
            default:
                return '#666';
        }
    }};
    color: ${(props) => (props.severity === 'Low' ? '#000' : '#fff')};
`;

const ConfidenceBar = styled.div`
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
        width: ${(props) => props.confidence}%;
        background: linear-gradient(90deg, #ff4444, #ffaa00, #00ff88);
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

const ThreatIndicatorsPage = () => {
    const [indicators, setIndicators] = useState([]);
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        severity: '',
        search: '',
    });

    useEffect(() => {
        loadIndicators();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [indicators, filters]);

    const loadIndicators = async () => {
        try {
            setLoading(true);
            const data = await threatLoomAPI.getThreatIndicators();
            setIndicators(data);
        } catch (error) {
            console.error('Failed to load threat indicators:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...indicators];

        if (filters.type) {
            filtered = filtered.filter((indicator) => indicator.type === filters.type);
        }

        if (filters.severity) {
            filtered = filtered.filter((indicator) => indicator.severity === filters.severity);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(
                (indicator) =>
                    indicator.value.toLowerCase().includes(searchTerm) ||
                    indicator.source.toLowerCase().includes(searchTerm),
            );
        }

        setFilteredIndicators(filtered);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const getStats = () => {
        const total = indicators.length;
        const critical = indicators.filter((i) => i.severity === 'Critical').length;
        const high = indicators.filter((i) => i.severity === 'High').length;
        const active = indicators.filter((i) => {
            const lastSeen = new Date(i.lastSeen);
            const now = new Date();
            const diffHours = (now - lastSeen) / (1000 * 60 * 60);
            return diffHours < 24;
        }).length;

        return { total, critical, high, active };
    };

    const stats = getStats();

    if (loading) {
        return (
            <PageContainer>
                <LoadingSpinner>Loading threat indicators...</LoadingSpinner>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <Title>🛡️ Threat Indicators</Title>
                <Subtitle>IOC management and threat context lookup</Subtitle>
            </PageHeader>

            <StatsBar>
                <StatCard>
                    <StatValue color="#00d4ff">{stats.total}</StatValue>
                    <StatLabel>Total Indicators</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue color="#ff4444">{stats.critical}</StatValue>
                    <StatLabel>Critical Threats</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue color="#ff8800">{stats.high}</StatValue>
                    <StatLabel>High Severity</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue color="#00ff88">{stats.active}</StatValue>
                    <StatLabel>Active (24h)</StatLabel>
                </StatCard>
            </StatsBar>

            <FilterBar>
                <FilterGroup>
                    <FilterLabel>Type</FilterLabel>
                    <FilterSelect
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="IP">IP Address</option>
                        <option value="Domain">Domain</option>
                        <option value="Hash">File Hash</option>
                        <option value="URL">URL</option>
                        <option value="Email">Email</option>
                    </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel>Severity</FilterLabel>
                    <FilterSelect
                        value={filters.severity}
                        onChange={(e) => handleFilterChange('severity', e.target.value)}
                    >
                        <option value="">All Severities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel>Search</FilterLabel>
                    <SearchInput
                        placeholder="Search indicators..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </FilterGroup>
            </FilterBar>

            <TableContainer>
                <TableHeader>
                    <TableTitle>Threat Indicators ({filteredIndicators.length})</TableTitle>
                </TableHeader>

                <Table>
                    <TableHeaderRow>
                        <div>Type</div>
                        <div>Indicator Value</div>
                        <div>Severity</div>
                        <div>Source</div>
                        <div>First Seen</div>
                        <div>Confidence</div>
                        <div>Tags</div>
                    </TableHeaderRow>

                    {filteredIndicators.slice(0, 100).map((indicator) => (
                        <TableRow key={indicator.id}>
                            <TableCell>{indicator.type}</TableCell>
                            <TableCell>
                                <IOCValue title={indicator.value}>{indicator.value}</IOCValue>
                            </TableCell>
                            <TableCell>
                                <SeverityBadge severity={indicator.severity}>
                                    {indicator.severity}
                                </SeverityBadge>
                            </TableCell>
                            <TableCell>{indicator.source}</TableCell>
                            <TableCell>
                                {new Date(indicator.firstSeen).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <ConfidenceBar confidence={indicator.confidence} />
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                                    {indicator.confidence}%
                                </span>
                            </TableCell>
                            <TableCell>
                                {indicator.tags.slice(0, 2).map((tag, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            background: '#444',
                                            padding: '0.2rem 0.4rem',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            marginRight: '0.25rem',
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </TableContainer>
        </PageContainer>
    );
};

export default ThreatIndicatorsPage;
