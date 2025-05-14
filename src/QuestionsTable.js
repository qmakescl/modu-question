import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import SearchIcon from '@mui/icons-material/Search';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Papa from 'papaparse';

// Load from local CSV with category
const CSV_URL = 'https://raw.githubusercontent.com/q4all/greenpaper/refs/heads/main/2025%EB%85%84%20%EC%8B%9C%EC%A6%8C1/%EB%AA%A8%EB%91%90%EC%9D%98%EC%A7%88%EB%AC%B8Q%20%EC%8B%9C%EC%A6%8C1.csv';

export default function QuestionsTable() {
  const [rows, setRows] = useState([]);
  // Only show these columns, with custom display names
  const columnOrder = [
    { key: 'seq', label: '순서', width: 1 },
    { key: 'title', label: '제목', width: 3 },
    { key: 'contents', label: '내용', width: 7 },
    { key: 'register_dtm', label: '등록일자', width: 1 }
  ];
  const [columns, setColumns] = useState(columnOrder.map(col => col.key));
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHtml, setModalHtml] = useState('');

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (result) => {
        // Use only the desired columns
        setColumns(columnOrder.map(col => col.key));
        setRows(result.data.filter(row => Object.values(row).some(Boolean)));
        setLoading(false);
      },
      error: () => setLoading(false),
      encoding: 'UTF-8',
    });
  }, []);

  // Include 'category' in search
  const filteredRows = rows.filter(row =>
    columns.some(col => (row[col] || '').toLowerCase().includes(search.toLowerCase())) ||
    (row['category'] || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Paper sx={{ width: '100%', minWidth: 600, overflow: 'auto' }}>
        {/* 분류별 통계 시각화 */}
        <CategoryStats rows={rows} />
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <TextField
            label="질문 검색"
            variant="outlined"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ width: '100%', maxWidth: 400, background: '#f8fafc' }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#bbb' }} />,
              endAdornment: loading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null,
            }}
          />
        </Box>
        {loading ? (
          <CircularProgress sx={{ display: 'block', m: 4, mx: 'auto' }} />
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader sx={{ width: '100%', minWidth: 600, maxWidth: '100vw', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '7%' }} />   {/* 순서 seq */}
                <col style={{ width: '21%' }} />  {/* 제목 title */}
                <col style={{ width: '7%' }} />   {/* 분류 category */}
                <col style={{ width: '43%' }} />  {/* 내용 contents */}
                <col style={{ width: '7%' }} />   {/* 등록일자 register_dtm */}
              </colgroup>
              <TableHead>
                <TableRow>
                  {columnOrder.map(col => (
                    <TableCell
                      key={col.key}
                      sx={{
                        flexBasis: `${col.width * 10}%`,
                        minWidth: col.key === 'contents' ? 120 : 40,
                        fontWeight: 'bold',
                        background: '#f8fafc',
                        textAlign: 'center'
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                  <TableRow hover key={idx}>
                    {columnOrder.map((col, colIdx) => {
                      if (col.key === 'seq') {
                        // Always show a sequence number
                        return (
                          <TableCell
                            key={col.key}
                            sx={{ width: '7%', minWidth: 0, textAlign: 'center', fontWeight: 500 }}
                          >
                            {row[col.key] || (page * rowsPerPage + idx + 1)}
                          </TableCell>
                        );
                      } else if (col.key === 'contents') {
                        // Remove HTML tags for preview
                        const plainText = row[col.key].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
                        const shortText = plainText.length > 100 ? plainText.slice(0, 100) + '…' : plainText;
                        return (
                          <TableCell
                            key={col.key}
                            sx={{
                              width: '43%',
                              minWidth: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'pointer',
                              color: '#1976d2',
                              textDecoration: 'underline',
                              boxSizing: 'border-box'
                            }}
                            onClick={() => {
                              setModalHtml(row[col.key]);
                              setModalOpen(true);
                            }}
                            title="클릭하면 전체 내용을 볼 수 있습니다."
                          >
                            {shortText}
                          </TableCell>
                        );
                      } else if (col.key === 'category') {
                        // Center-align category
                        return (
                          <TableCell
                            key={col.key}
                            sx={{ width: '7%', minWidth: 0, textAlign: 'center', fontWeight: 500 }}
                          >
                            {row[col.key]}
                          </TableCell>
                        );
                      } else if (col.key === 'title') {
                        return (
                          <TableCell
                            key={col.key}
                            sx={{
                              width: '21%',
                              minWidth: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              boxSizing: 'border-box',
                              textAlign: 'center'
                            }}
                          >
                            {row[col.key]}
                          </TableCell>
                        );
                      } else if (col.key === 'register_dtm') {
                        // Only show YYYY-MM-DD
                        const date = row[col.key] ? String(row[col.key]).slice(0, 10) : '';
                        return (
                          <TableCell
                            key={col.key}
                            sx={{ width: '7%', minWidth: 0, whiteSpace: 'nowrap', boxSizing: 'border-box' }}
                          >
                            {date}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell
                            key={col.key}
                            sx={{ width: '6%', minWidth: 0, whiteSpace: 'nowrap', boxSizing: 'border-box' }}
                          >
                            {row[col.key]}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[50, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
          전체 내용 보기
          <IconButton aria-label="close" onClick={() => setModalOpen(false)} sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div style={{ maxHeight: '60vh', overflow: 'auto', background: '#f9f9f9', padding: 16 }}
            dangerouslySetInnerHTML={{ __html: modalHtml }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
