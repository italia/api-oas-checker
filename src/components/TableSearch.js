import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { matchSorter } from 'match-sorter';
import { Icon } from 'design-react-kit';
import { UncontrolledTooltip } from 'reactstrap';
import { renderMarkdown } from '../utils.mjs';

const { useTable, useFilters, useGlobalFilter } = require('react-table');

function MyCell({ value }) {
  const content = value && value.trim() !== '' && value !== '[]' && value !== '""' ? value : null;

  const descriptionMarkup = React.useMemo(
    () => ({
      __html: renderMarkdown(content ?? ''),
    }),
    [content]
  );

  if (!content) {
    return <span className="text-muted font-italic small">N/A</span>;
  }

  return <div dangerouslySetInnerHTML={descriptionMarkup} />;
}
MyCell.propTypes = {
  value: PropTypes.string,
};

function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <div className="form-group mb-0">
      <input
        className="form-control form-control-sm"
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count}...`}
        style={{ minWidth: '80px' }}
      />
    </div>
  );
}
DefaultColumnFilter.propTypes = {
  column: PropTypes.object.isRequired,
};

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}
fuzzyTextFilterFn.autoRemove = (val) => !val;

function Table({ columns, data, className }) {
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
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
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter
  );

  const pageSize = 30;
  const firstPageRows = rows.slice(0, pageSize);

  return (
    <div className="table-responsive">
      <table className={cx('table table-hover table-sm table-bordered bg-white', className)} {...getTableProps()}>
        <thead className="thead-light">
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th key={j} {...column.getHeaderProps()} className="align-top py-3">
                  <div className="mb-2 text-uppercase small font-weight-bold">{column.render('Header')}</div>
                  {column.canFilter ? column.render('Filter') : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, rowId) => {
            prepareRow(row);
            return (
              <tr key={rowId} {...row.getRowProps()}>
                {row.cells.map((cell, cellId) => (
                  <td key={cellId} {...cell.getCellProps()} className="align-middle p-3">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length > pageSize && (
        <div className="mt-3 small text-muted text-center">
          Showing first {pageSize} of {rows.length} operations.
        </div>
      )}
    </div>
  );
}
Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default function TableSearch({ data, className }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Technical Core',
        columns: [
          {
            Header: () => (
              <span>
                Method <Icon icon="it-info-circle" size="xs" id="tooltip-method" style={{ verticalAlign: 'middle' }} />
                <UncontrolledTooltip placement="top" target="tooltip-method">
                  HTTP Method (e.g. GET, POST)
                </UncontrolledTooltip>
              </span>
            ),
            accessor: 'method',
            filter: 'fuzzyText',
          },
          {
            Header: () => (
              <span>
                Path <Icon icon="it-info-circle" size="xs" id="tooltip-path" style={{ verticalAlign: 'middle' }} />
                <UncontrolledTooltip placement="top" target="tooltip-path">
                  Endpoint Path
                </UncontrolledTooltip>
              </span>
            ),
            accessor: 'path',
            filter: 'fuzzyText',
          },
          {
            Header: () => (
              <span>
                Inputs <Icon icon="it-info-circle" size="xs" id="tooltip-inputs" style={{ verticalAlign: 'middle' }} />
                <UncontrolledTooltip placement="top" target="tooltip-inputs">
                  Parameters (header, query, path, cookie) and Request Body
                </UncontrolledTooltip>
              </span>
            ),
            accessor: 'inputs',
            filter: 'includes',
            Cell: MyCell,
          },
          {
            Header: () => (
              <span>
                Outputs <Icon icon="it-info-circle" size="xs" id="tooltip-outputs" style={{ verticalAlign: 'middle' }} />
                <UncontrolledTooltip placement="top" target="tooltip-outputs">
                  Response Statuses and Schemas
                </UncontrolledTooltip>
              </span>
            ),
            accessor: 'outputs',
            filter: 'includes',
            Cell: MyCell,
          },
        ],
      },
      {
        Header: 'Metadata (Optional)',
        columns: [
          {
            Header: () => (
              <span>
                Summary <Icon icon="it-info-circle" size="xs" id="tooltip-summary" style={{ verticalAlign: 'middle' }} />
                <UncontrolledTooltip placement="top" target="tooltip-summary">
                  Operation Summary
                </UncontrolledTooltip>
              </span>
            ),
            accessor: 'what',
            filter: 'fuzzyText',
            Cell: MyCell,
          },
          {
            Header: () => (
              <span>
                Operation ID <Icon icon="it-info-circle" size="xs" id="tooltip-id" style={{ verticalAlign: 'middle' }} />
                <UncontrolledTooltip placement="top" target="tooltip-id">
                  Unique Identifier for the operation
                </UncontrolledTooltip>
              </span>
            ),
            accessor: 'id',
            filter: 'fuzzyText',
          },
          {
            Header: () => (
              <span>
                Who <Icon icon="it-info-circle" size="xs" id="tooltip-who" style={{ verticalAlign: 'middle' }} />
                <UncontrolledTooltip placement="top" target="tooltip-who">
                  Security schemes (e.g. OAuth2, API Key) required to access this operation.
                </UncontrolledTooltip>
              </span>
            ),
            accessor: 'who',
            filter: 'fuzzyText',
            Cell: MyCell,
          },
          {
            Header: () => (
              <span>
                Goal <Icon icon="it-info-circle" size="xs" id="tooltip-goal" style={{ verticalAlign: 'middle' }} />
                <UncontrolledTooltip placement="top" target="tooltip-goal">
                  Tags indicating the functional goal or resource group.
                </UncontrolledTooltip>
              </span>
            ),
            accessor: 'goal',
            filter: 'fuzzyText',
          },
        ],
      },
    ],
    []
  );

  return <Table className={className} columns={columns} data={data} />;
}