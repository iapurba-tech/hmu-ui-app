import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Shield as ShieldIcon,
  ArrowForwardRounded as ArrowForward,
  FactoryRounded as Factory,
  LanguageRounded as GlobalIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../../../shared/store/useAuthStore';
import {
  modalOverlayStyles,
  modalContainerStyles,
  headerStyles,
  technicalLabelStyles,
  searchContainerStyles,
  searchInputStyles,
  unitListStyles,
  unitCardStyles,
  iconBoxStyles,
  footerStyles,
  confirmButtonStyles,
} from './UnitSelectionModal.styles';

interface UnitSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

const UnitSelectionModal: React.FC<UnitSelectionModalProps> = ({ open, onClose }) => {
  const { user, selectedUnit, setSelectedUnit, setPortal } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelectedId, setTempSelectedId] = useState<string | 'global'>(
    selectedUnit?.id || 'global'
  );

  const globalAdmin = {
    id: 'global',
    name: 'Global Administration',
    code: 'SYSTEM-ROOT',
    status: 'active' as const,
    totalUnits: user?.units.length || 0,
    activeUnits: user?.units.filter(u => u.status === 'active').length || 0,
    dailyVolume: 'AGGREGATED',
    color: '#BC4800', // Tertiary Color
  };

  const units = user?.role === 'ROLE_SYSTEM_ADMIN' 
    ? [globalAdmin, ...(user?.units || [])]
    : user?.units || [];

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    if (tempSelectedId === 'global') {
      setSelectedUnit(null);
      setPortal('admin');
    } else {
      const unit = user?.units.find(u => u.id === tempSelectedId);
      if (unit) {
        setSelectedUnit(unit);
        setPortal('management');
      }
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: modalOverlayStyles,
        },
      }}
    >
      <Box sx={modalContainerStyles}>
        {/* Modal Header */}
        <Box sx={headerStyles}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ width: 4, height: 18, bgcolor: '#0077b8', borderRadius: 1 }} />
              <Typography sx={technicalLabelStyles}>Access Management</Typography>
            </Box>
            <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Select Workspace
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
              Switch between global administration and operational units.
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: '#94a3b8',
              '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a' },
              borderRadius: '14px',
              p: 1.5
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Search Section (Commented out for now) */}
        {/* <Box sx={searchContainerStyles}>
          <TextField
            fullWidth
            placeholder="Search by name, code or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={searchInputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', ml: 1 }} fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box> */}

        {/* Unit List */}
        <Box sx={unitListStyles}>
          {filteredUnits.map((item) => {
            const isSelected = tempSelectedId === item.id;
            const isGlobal = item.id === 'global';
            const color = (item as any).color || '#0077b8';

            return (
              <Box
                key={item.id}
                sx={unitCardStyles(isSelected, color)}
                onClick={() => setTempSelectedId(item.id as any)}
              >
                <Box sx={iconBoxStyles(color)}>
                  {isGlobal ? <GlobalIcon /> : <Factory />}
                </Box>
                
                <Box sx={{ ml: 2.5, flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                      {item.name}
                    </Typography>
                    {isSelected && (
                      <CheckCircleIcon sx={{ color: color }} fontSize="small" />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ 
                      fontSize: '9px', 
                      fontWeight: 800, 
                      color: color, 
                      bgcolor: alpha(color, 0.08), 
                      px: 1, 
                      py: 0.25,
                      borderRadius: '6px',
                      letterSpacing: '0.05em'
                    }}>
                      {item.code}
                    </Typography>
                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#cbd5e1' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        bgcolor: item.status === 'active' ? '#22c55e' : '#94a3b8',
                      }} />
                      <Typography sx={{ 
                        fontSize: '10px', 
                        fontWeight: 700, 
                        color: item.status === 'active' ? '#16a34a' : '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {item.status}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 4, pt: 1.5, borderTop: '1px solid rgba(241, 245, 249, 0.8)' }}>
                    <Box>
                      <Typography sx={{ fontSize: '8px', fontWeight: 800, color: '#94a3b8', mb: 0.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {isGlobal ? 'Total Units' : 'MPCS Units'}
                      </Typography>
                      <Typography sx={{ fontWeight: 800, color: '#334155', fontSize: '0.875rem' }}>
                        {isGlobal ? (item as any).totalUnits : (item as any).mpcsUnits}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '8px', fontWeight: 800, color: '#94a3b8', mb: 0.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {isGlobal ? 'Active' : 'Daily Volume'}
                      </Typography>
                      <Typography sx={{ fontWeight: 800, color: '#334155', fontSize: '0.875rem' }}>
                        {isGlobal ? (item as any).activeUnits : (item as any).dailyVolume}
                      </Typography>
                    </Box>
                    {isGlobal && (
                       <Box>
                       <Typography sx={{ fontSize: '8px', fontWeight: 800, color: '#94a3b8', mb: 0.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                         System
                       </Typography>
                       <Typography sx={{ fontWeight: 800, color: '#334155', fontSize: '0.875rem' }}>
                         ROOT
                       </Typography>
                     </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Modal Footer */}
        <Box sx={footerStyles}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 42, 
              height: 42, 
              borderRadius: '14px', 
              bgcolor: '#ffffff', 
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0077b8',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <ShieldIcon fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Secure Access
              </Typography>
              <Typography sx={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>
                Node: HMU-PROD-01
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button 
              onClick={onClose}
              sx={{ 
                color: '#64748b', 
                fontWeight: 700, 
                fontSize: '14px',
                px: 3,
                textTransform: 'none',
                '&:hover': { color: '#0f172a', bgcolor: 'rgba(0,0,0,0.03)' }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleConfirm}
              sx={confirmButtonStyles}
              endIcon={<ArrowForward />}
            >
              Switch to Workspace
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UnitSelectionModal;
