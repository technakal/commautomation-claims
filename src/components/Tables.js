import React, { Component } from 'react';
import ErrorDisplay from './Error';

const TableRow = props => {
  const { merit, editClaim, deleteClaim } = props;
  const {
    state,
    policyStart,
    policyEnd,
    lossValue,
    otherClaims,
    indemnityClaims,
    id
  } = props.record;
  return (
    <div
      className={
        merit
          ? 'table-grid table-grid-merit'
          : 'table-grid table-grid-aggregate'
      }
      id={id}>
      {merit ? <p>{state}</p> : null}
      <p>{policyStart}</p>
      <p>{policyEnd}</p>
      {merit ? (
        <input
          id={`${id}-lv`}
          type="number"
          min="0"
          onBlur={() => editClaim(id)}
        />
      ) : (
        <p>{lossValue}</p>
      )}
      {merit ? (
        <input
          id={`${id}-oc`}
          type="number"
          min="0"
          onBlur={() => editClaim(id)}
        />
      ) : null}
      {merit ? (
        <input
          id={`${id}-ic`}
          type="number"
          min="0"
          onBlur={() => editClaim(id)}
        />
      ) : null}
      {!merit ? <button onClick={() => deleteClaim(id)}>Delete</button> : null}
    </div>
  );
};

class TableRowEmpty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: null
    };
    this.predictPolicyEnd = this.predictPolicyEnd.bind(this);
    this.checkValidDate = this.checkValidDate.bind(this);
  }

  checkValidDate() {
    const policyStart = document.getElementById('policyStart').value;
    const policyEnd = document.getElementById('policyEnd').value;
    policyStart > policyEnd
      ? this.setState({
          error: true,
          errorMessage: 'Policy end date must be greater than start date. Duh!'
        })
      : this.setState({ error: false, errorMessage: null });
  }

  predictPolicyEnd() {
    const date = document.getElementById('policyStart').value.split('-');
    const nextYear = Number(date[0]) + 1;
    const nextDate = [nextYear, date[1], date[2]];
    document.getElementById('policyEnd').value = nextDate.join('-');
  }

  render() {
    const { button, addRecord } = this.props;
    return (
      <div>
        <div className="table-grid table-grid-aggregate">
          <input type="date" id="policyStart" onBlur={this.predictPolicyEnd} />
          <input
            type="date"
            id="policyEnd"
            onBlur={this.checkValidDate}
            className={this.state.error ? 'error' : null}
          />
          <input type="number" min="1" id="lossValue" />
          <button onClick={addRecord} disabled={this.state.error}>
            Add
          </button>
        </div>
        {this.state.error ? (
          <div className="table-grid table-grid-aggregate">
            <p className="error-message col-2">
              End date must be after start date. Duh!
            </p>
          </div>
        ) : null}
      </div>
    );
  }
}

const TableBody = props => {
  const { records, merit, emptyRow, addRecord, editClaim, deleteClaim } = props;
  return (
    <div>
      {emptyRow ? <TableRowEmpty addRecord={addRecord} /> : null}
      {records.map(record => (
        <TableRow
          id={record.id}
          record={record}
          key={record.id}
          merit={merit}
          editClaim={editClaim}
          deleteClaim={deleteClaim}
        />
      ))}
    </div>
  );
};

const TableHeader = props => {
  const { merit } = props;
  return (
    <header className="table-header-labels">
      <div
        className={
          merit
            ? 'table-grid table-grid-merit'
            : 'table-grid table-grid-aggregate'
        }>
        {merit ? <p>State</p> : null}
        <p>Policy Start</p>
        <p>Policy End</p>
        {merit ? <p>Loss Value by State</p> : <p>Total Loss Value</p>}
        {merit ? <p># Other Claims</p> : null}
        {merit ? <p># Indemnity Claims</p> : null}
      </div>
    </header>
  );
};

const Table = props => {
  const { merit, records, addRecord, editClaim, deleteClaim, emptyRow } = props;
  return (
    <div className="table">
      <TableHeader merit={merit} />
      <TableBody
        records={records}
        merit={merit}
        editClaim={editClaim}
        addRecord={addRecord}
        deleteClaim={deleteClaim}
        emptyRow={emptyRow}
      />
    </div>
  );
};

const MeritTable = props => {
  const { records, editClaim } = props;
  return (
    <div>
      <h3>Looks like this policy has some merit states.</h3>
      {records.length ? (
        <p>Enter claims information, by year, for each state listed below.</p>
      ) : (
        <p>Enter some aggregate claims info above to start setting up merit</p>
      )}
      {records.length ? (
        <Table
          records={records}
          merit={true}
          editClaim={editClaim}
          emptyRow={false}
        />
      ) : null}
    </div>
  );
};

const AggregateTable = props => {
  const { addRecord, records, deleteClaim } = props;
  return (
    <div>
      <h2>Aggregate Claims Information</h2>
      <p>
        Enter the total value of claims, by policy period, for the insured while
        they were with another, lesser carrier.
      </p>
      <Table
        records={records}
        merit={false}
        emptyRow={true}
        addRecord={addRecord}
        deleteClaim={deleteClaim}
      />
    </div>
  );
};

export { AggregateTable, MeritTable };
