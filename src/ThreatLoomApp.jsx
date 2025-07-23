import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CollapsibleNavigation from './components/CollapsibleNavigation';
import DashboardPage from './pages/DashboardPage';
import ThreatIndicatorsPage from './pages/ThreatIndicatorsPage';
import AnomalyDetectionPage from './pages/AnomalyDetectionPage';
import AlertsIncidentsPage from './pages/AlertsIncidentsPage';
import ThreatAnalyticsPage from './pages/ThreatAnalyticsPage';
import IntelligenceFeedsPage from './pages/IntelligenceFeedsPage';
import PlaybooksPage from './pages/PlaybooksPage';
import SettingsPage from './pages/SettingsPage';

const AppContainer = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    overflow: hidden;
`;

const MainContent = styled.main`
    flex: 1;
    height: 100vh;
    overflow-y: auto;
    transition: margin-left 0.3s ease;
    margin-left: ${(props) => (props.isCollapsed ? '60px' : '280px')};

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

const ThreatLoomApp = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const navigateToPage = (page) => {
        setCurrentPage(page);
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'threat-indicators':
                return <ThreatIndicatorsPage />;
            case 'anomaly-detection':
                return <AnomalyDetectionPage />;
            case 'alerts':
                return <AlertsIncidentsPage />;
            case 'threat-analytics':
                return <ThreatAnalyticsPage />;
            case 'intelligence-feeds':
                return <IntelligenceFeedsPage />;
            case 'playbooks':
                return <PlaybooksPage />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <AppContainer>
            <CollapsibleNavigation
                isCollapsed={isCollapsed}
                onToggle={toggleSidebar}
                onNavigate={navigateToPage}
                currentPage={currentPage}
            />
            <MainContent isCollapsed={isCollapsed}>{renderCurrentPage()}</MainContent>
        </AppContainer>
    );
};

export default ThreatLoomApp;
