import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function CategoryStats({ rows }) {
  const [open, setOpen] = React.useState(true);
  if (!rows || rows.length === 0) return null;
  // 집계
  const counts = {};
  let total = 0;
  rows.forEach(row => {
    const cat = (row.category || '기타').trim();
    counts[cat] = (counts[cat] || 0) + 1;
    total++;
  });
  // 비율 내림차순 정렬 및 10개 미만 필터링
  const sorted = Object.entries(counts)
    .filter(([cat, count]) => count >= 10)
    .sort((a, b) => b[1] - a[1]);
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Button
        variant="text"
        size="small"
        sx={{ color: '#1976d2', fontWeight: 700, mb: 1, ml: 2, textTransform: 'none' }}
        startIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        onClick={() => setOpen(o => !o)}
      >
        {open ? '분류별 질문 분포 숨기기' : '분류별 질문 분포 보기'}
      </Button>
      {open && (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1, p: 3, fontWeight: 700, color: '#1976d2' }}>
            분류별 질문 분포
          </Typography>
          {sorted.map(([cat, count]) => (
            <Box key={cat} sx={{ display: 'flex', alignItems: 'center', mb: 0.5, px: 3 }}>
              {/* 1. 분류명 */}
              <Box sx={{ width: 120, minWidth: 120, maxWidth: 120, fontSize: 13, color: '#333', textAlign: 'left', pr: 2, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</Box>
              {/* 2. 도표 */}
              <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                <LinearProgress variant="determinate" value={count * 100 / total} sx={{ height: 10, borderRadius: 5, bgcolor: '#f0f4fa', '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' } }} />
              </Box>
              {/* 3. 숫자/비율 */}
              <Box sx={{ width: 60, minWidth: 60, fontSize: 13, color: '#555', textAlign: 'right', flexShrink: 0 }}>{count} ({((count * 100 / total).toFixed(1))}%)</Box>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
