import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  SearchPanel,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui'
import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid'
import { Paper, Typography, Chip } from '@mui/material'
import { SearchState, IntegratedFiltering } from '@devexpress/dx-react-grid'

const TableCellComponent = ({ ...props }) => (
  <Table.Cell
    {...props}
    style={{ paddingTop: 10, paddingBottom: 10 }}
  />
);

const ResultTable = ({
  data,
}) => {
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchState] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([25, 50, 100]);
  useEffect(() => {
    (async () => {
      const resultRows = (data).map((number, index) => ({
        id: index + 1,
        result_number:
          (
            <Typography sx={{ fontSize: 14, fontWeight: '600' }}>{number.num}</Typography>
          ),
        result_count:
          (
            <Typography sx={{ fontSize: 14, fontWeight: '600' }}>{number.count}</Typography>
          ),
      }))
      let finalCount = data.reduce((n, { count }) => n + count, 0)
      resultRows.push({
        id: data.length + 1,
        result_number: "",
        result_count:
          (
            <Typography sx={{ fontSize: 16, fontWeight: '800' }}>Total: <Chip sx={{ ml: 0.5, fontSize: 16 }} label={finalCount} color="primary" size="small" /></Typography>
          ),
      })
      setRows(resultRows)
    })();

  }, [data, setRows])
  const columns = [
    { name: 'result_number', title: 'Respuestas' },
    { name: 'result_count', title: 'Frecuencia (Cantidad de repeticiones)' },
  ]

  const [tableColumnExtensions] = useState([
    { columnName: 'result_number', align: 'center', width: '50%', wordWrapEnabled: true },
    { columnName: 'result_count', align: 'center', width: '50%' },
  ])

  const PagingPanelContainer = ({ ...props }) => <PagingPanel.Container {...props} />

  const pagingMessages = {
    info: ({ from, to, count }) => `${from}${from < to ? `-${to}` : ''} ${'de'} ${count}`,
    rowsPerPage: 'Respuestas por página',
  }

  const searchMessages = {
    searchPlaceholder: 'Buscar',
  }

  const tableMessages = {
    noData: "No hay registros",
  };

  return (
    <>
      <Paper className="table1">
        <Grid rows={rows} columns={columns}>
          <SearchState value={searchValue} onValueChange={setSearchState} />
          <IntegratedFiltering />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
          <IntegratedPaging />
          <Table columnExtensions={tableColumnExtensions} messages={tableMessages} cellComponent={TableCellComponent} />
          <TableHeaderRow />
          <Toolbar />
          <SearchPanel messages={searchMessages} />
          <PagingPanel
            containerComponent={PagingPanelContainer}
            messages={pagingMessages}
            pageSizes={pageSizes}
          />
        </Grid>
      </Paper>
    </>
  )
}

ResultTable.propTypes = {
  data: PropTypes.array,
}

export default ResultTable