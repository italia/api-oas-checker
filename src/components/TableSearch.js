import React from 'react';
import { useTable, useFilters, useGlobalFilter } from 'react-table';
import PropTypes from 'prop-types';
// A library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import { renderMarkdown } from '../utils.mjs';

function MyCell({ value }) {
  console.log('MyCell', value);
  const descriptionMarkup = React.useMemo(
    () => ({
      __html: renderMarkdown(value ?? ''),
    }),
    [value]
  );

  return <div dangerouslySetInnerHTML={descriptionMarkup} />;
}
MyCell.propTypes = {
  value: PropTypes.func.isRequired,
};

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}
DefaultColumnFilter.propTypes = {
  column: PropTypes.object.isRequired,
};
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  className: PropTypes.string,
};

// Our table component
function Table({ columns, data, className }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) =>
        rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        }),
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, visibleColumns } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter // useGlobalFilter!
  );
  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  const pageSize = 30;
  const firstPageRows = rows.slice(0, pageSize);

  return (
    <>
      <table className={className} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th key={j} {...column.getHeaderProps()}>
                  {column.render('Header')}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            ></th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, rowId) => {
            prepareRow(row);
            return (
              <tr key={rowId} {...row.getRowProps()}>
                {row.cells.map((cell, cellId) => (
                  <td key={cellId} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>
        Showing the first {pageSize} results of {rows.length} rows
      </div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== 'number';
TableSearch.propTypes = {
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
};
export default function TableSearch({ data, className }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Operation',
        columns: [
          {
            Header: 'Operation',
            accessor: 'id',
          },
          {
            Header: 'Goals',
            accessor: 'goal',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Who',
            accessor: 'who',
            filter: 'fuzzyText',
            Cell: MyCell,
          },
          {
            Header: 'What',
            accessor: 'what',
            filter: 'fuzzyText',
            Cell: MyCell,
          },
          {
            Header: 'How',
            accessor: 'how',
            filter: 'includes',
            Cell: MyCell,
          },
          {
            Header: 'Inputs',
            accessor: 'inputs',
            filter: 'includes',
            Cell: MyCell,
          },
          {
            Header: 'Outputs',
            accessor: 'outputs',
            filter: 'includes',
            Cell: MyCell,
          },
        ],
      },
    ],
    []
  );

  const indata = React.useMemo(() => data, [data]);
  return <Table className={className} columns={columns} data={indata} />;
}
