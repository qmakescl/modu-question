import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import QuestionsTable from '../src/QuestionsTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f6f7fb', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, px: 3 }}>
      {/* Header */}
      <Box sx={{ width: '100%', bgcolor: '#fff', borderBottom: '1px solid #e0e3ea', py: 2, px: 3, mb: 4, boxShadow: '0 2px 8px 0 rgba(60,72,88,.04)' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FontAwesomeIcon icon={faComments} style={{ color: '#1976d2', fontSize: 30, marginRight: 8 }} />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: -1 }}>
              모두의 질문 Q
            </Typography>
          </Box>
          <a href="https://github.com/q4all/greenpaper" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Typography variant="caption" sx={{ color: '#888', fontSize: 15, fontWeight: 500 }}>
            데이터 출처 - 모두의 질문 Q - Green Paper
            </Typography>
            <FontAwesomeIcon icon={faGithub} style={{ fontSize: 22, marginRight: 6 }} />
          </a>
        </Box>
      </Box>
      {/* Table Card */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Paper elevation={0} sx={{ p: { xs: 1, sm: 3 }, width: '100%', borderRadius: 3, boxShadow: '0 2px 16px 0 rgba(60,72,88,.08)', bgcolor: '#fff' }}>
          <QuestionsTable />
        </Paper>
      </Box>
      {/* Footer: Code Source */}
      <Box sx={{ width: '100%', mt: 6, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ color: '#aaa', fontSize: 13, textAlign: 'center' }}>
          Code from <a href="https://github.com/qmakescl/modu-question" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline' }}>
            https://github.com/qmakescl/modu-question
          </a> under CC0
        </Typography>
      </Box>
    </Box>
  );
}
