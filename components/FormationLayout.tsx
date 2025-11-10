
import React from 'react';

interface PositionWrapperProps {
  top: string;
  left: string;
  children: React.ReactNode;
}

const PositionWrapper: React.FC<PositionWrapperProps> = ({ top, left, children }) => (
  <div className="absolute" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
    {children}
  </div>
);

interface FormationLayoutProps {
  formationName: string;
  positions: Record<string, React.ReactNode>;
}

const FormationLayout: React.FC<FormationLayoutProps> = ({ formationName, positions }) => {
    if (formationName === '4-3-3') {
        return (
            <React.Fragment>
                <PositionWrapper top="14%" left="50%">{positions['ST']}</PositionWrapper>
                <PositionWrapper top="25%" left="15%">{positions['LW']}</PositionWrapper>
                <PositionWrapper top="25%" left="85%">{positions['RW']}</PositionWrapper>
                <PositionWrapper top="45%" left="30%">{positions['CM1']}</PositionWrapper>
                <PositionWrapper top="45%" left="70%">{positions['CM2']}</PositionWrapper>
                <PositionWrapper top="60%" left="50%">{positions['DM']}</PositionWrapper>
                <PositionWrapper top="73%" left="15%">{positions['LB']}</PositionWrapper>
                <PositionWrapper top="73%" left="85%">{positions['RB']}</PositionWrapper>
                <PositionWrapper top="78%" left="38%">{positions['CB1']}</PositionWrapper>
                <PositionWrapper top="78%" left="62%">{positions['CB2']}</PositionWrapper>
                <PositionWrapper top="92%" left="50%">{positions['GK']}</PositionWrapper>
            </React.Fragment>
        )
    }
    if (formationName === '4-2-4') {
        return (
            <React.Fragment>
                <PositionWrapper top="15%" left="38%">{positions['CFD1']}</PositionWrapper>
                <PositionWrapper top="15%" left="62%">{positions['CFD2']}</PositionWrapper>
                <PositionWrapper top="25%" left="15%">{positions['LWMF']}</PositionWrapper>
                <PositionWrapper top="25%" left="85%">{positions['RWMF']}</PositionWrapper>
                <PositionWrapper top="55%" left="35%">{positions['DM1']}</PositionWrapper>
                <PositionWrapper top="55%" left="65%">{positions['DM2']}</PositionWrapper>
                <PositionWrapper top="73%" left="15%">{positions['FB1']}</PositionWrapper>
                <PositionWrapper top="75%" left="38%">{positions['CB1']}</PositionWrapper>
                <PositionWrapper top="75%" left="62%">{positions['CB2']}</PositionWrapper>
                <PositionWrapper top="73%" left="85%">{positions['FB2']}</PositionWrapper>
                <PositionWrapper top="92%" left="50%">{positions['GK']}</PositionWrapper>
            </React.Fragment>
        )
    }
    if (formationName === '4-2-3-1') {
        return (
            <React.Fragment>
                <PositionWrapper top="12%" left="50%">{positions['ST']}</PositionWrapper>
                <PositionWrapper top="22%" left="20%">{positions['LW']}</PositionWrapper>
                <PositionWrapper top="22%" left="80%">{positions['RW']}</PositionWrapper>
                <PositionWrapper top="30%" left="50%">{positions['AM']}</PositionWrapper>
                <PositionWrapper top="55%" left="35%">{positions['DM1']}</PositionWrapper>
                <PositionWrapper top="55%" left="65%">{positions['DM2']}</PositionWrapper>
                <PositionWrapper top="73%" left="15%">{positions['LB']}</PositionWrapper>
                <PositionWrapper top="73%" left="85%">{positions['RB']}</PositionWrapper>
                <PositionWrapper top="78%" left="38%">{positions['CB1']}</PositionWrapper>
                <PositionWrapper top="78%" left="62%">{positions['CB2']}</PositionWrapper>
                <PositionWrapper top="92%" left="50%">{positions['GK']}</PositionWrapper>
            </React.Fragment>
        )
    }
    return null;
}

export default FormationLayout;
