import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: ${(props) => (props.isCollapsed ? '60px' : '280px')};
    background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
    border-right: 1px solid #333;
    transition: width 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const Header = styled.div`
    padding: 1.5rem;
    border-bottom: 1px solid #333;
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const Logo = styled.div`
    width: 32px;
    height: 32px;
    background: linear-gradient(45deg, #00d4ff, #0099cc);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
`;

const Title = styled.h1`
    font-size: 1.2rem;
    font-weight: 600;
    color: #00d4ff;
    margin: 0;
    white-space: nowrap;
    opacity: ${(props) => (props.isCollapsed ? 0 : 1)};
    transition: opacity 0.3s ease;
`;

const ToggleButton = styled.button`
    position: absolute;
    top: 1.5rem;
    right: 1rem;
    background: #333;
    border: 1px solid #555;
    color: #fff;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;

    &:hover {
        background: #444;
    }
`;

const NavList = styled.ul`
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    flex: 1;
`;

const NavItem = styled.li`
    margin: 0.5rem 0;
`;

const NavLink = styled.button`
    width: 100%;
    background: ${(props) => (props.isActive ? 'rgba(0, 212, 255, 0.1)' : 'transparent')};
    border: none;
    color: ${(props) => (props.isActive ? '#00d4ff' : '#cccccc')};
    padding: 0.75rem 1.5rem;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    border-left: ${(props) => (props.isActive ? '3px solid #00d4ff' : '3px solid transparent')};

    &:hover {
        background: rgba(0, 212, 255, 0.05);
        color: #00d4ff;
    }

    .icon {
        width: 20px;
        text-align: center;
        flex-shrink: 0;
    }

    .label {
        white-space: nowrap;
        opacity: ${(props) => (props.isCollapsed ? 0 : 1)};
        transition: opacity 0.3s ease;
    }
`;

const StatusIndicator = styled.div`
    margin-top: auto;
    padding: 1rem;
    border-top: 1px solid #333;
    opacity: ${(props) => (props.isCollapsed ? 0 : 1)};
    transition: opacity 0.3s ease;
`;

const StatusItem = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
    font-size: 0.8rem;
    color: #999;

    .value {
        color: #00d4ff;
        font-weight: 600;
    }
`;

const navigation = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'threat-indicators', icon: '🛡️', label: 'Threat Indicators' },
    { id: 'anomaly-detection', icon: '🔍', label: 'Anomaly Detection' },
    { id: 'alerts', icon: '🚨', label: 'Alerts & Incidents' },
    { id: 'threat-analytics', icon: '📊', label: 'Threat Analytics' },
    { id: 'intelligence-feeds', icon: '📡', label: 'Intelligence Feeds' },
    { id: 'playbooks', icon: '📋', label: 'Playbooks' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
];

const CollapsibleNavigation = ({ isCollapsed, onToggle, onNavigate, currentPage }) => {
    return (
        <SidebarContainer isCollapsed={isCollapsed}>
            <Header>
                <Logo>🛡️</Logo>
                <Title isCollapsed={isCollapsed}>ThreatLoom</Title>
                <ToggleButton onClick={onToggle}>{isCollapsed ? '→' : '←'}</ToggleButton>
            </Header>

            <NavList>
                {navigation.map((item) => (
                    <NavItem key={item.id}>
                        <NavLink
                            isActive={currentPage === item.id}
                            isCollapsed={isCollapsed}
                            onClick={() => onNavigate(item.id)}
                            title={isCollapsed ? item.label : ''}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </NavLink>
                    </NavItem>
                ))}
            </NavList>

            <StatusIndicator isCollapsed={isCollapsed}>
                <StatusItem>
                    <span>Active Threats</span>
                    <span className="value">127</span>
                </StatusItem>
                <StatusItem>
                    <span>Feeds Online</span>
                    <span className="value">8/9</span>
                </StatusItem>
                <StatusItem>
                    <span>System Status</span>
                    <span className="value">🟢 Online</span>
                </StatusItem>
            </StatusIndicator>
        </SidebarContainer>
    );
};

export default CollapsibleNavigation;
