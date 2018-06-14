import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

const TableRow = props => {
  const { merit, editClaim } = props;
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
    <tr>
      {merit ? <td>{state}</td> : null}
      <td>{policyStart}</td>
      <td>{policyEnd}</td>
      {merit ? (
        <td>
          <input type="number" min="0" defaultValue={lossValue} />
        </td>
      ) : (
        <td>{lossValue}</td>
      )}
      {merit ? (
        <td>
          <input type="number" min="0" defaultValue={otherClaims} />
        </td>
      ) : null}
      {merit ? (
        <td>
          <input type="number" min="0" defaultValue={indemnityClaims} />
        </td>
      ) : null}
      {merit ? (
        <td>
          <button onClick={() => editClaim(id)}>Update</button>
        </td>
      ) : null}
    </tr>
  );
};

class TableRowEmpty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
    this.predictPolicyEnd = this.predictPolicyEnd.bind(this);
    this.checkValidDate = this.checkValidDate.bind(this);
  }

  checkValidDate() {
    const policyStart = document.getElementById('policyStart').value;
    const policyEnd = document.getElementById('policyEnd').value;
    policyStart > policyEnd
      ? this.setState({ error: true })
      : this.setState({ error: false });
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
      <tr>
        <td>
          <input type="date" id="policyStart" onBlur={this.predictPolicyEnd} />
        </td>
        <td>
          <input
            type="date"
            id="policyEnd"
            onBlur={this.checkValidDate}
            className={this.state.error ? 'error' : null}
          />
        </td>
        <td>
          <span>$ </span>
          <input type="number" min="1" id="lossValue" />
        </td>
        <td>
          <button
            onClick={addRecord}
            disabled={this.state.error ? true : false}>
            Add Record
          </button>
        </td>
      </tr>
    );
  }
}

const TableHeader = props => {
  const { merit } = props;
  return (
    <thead>
      <tr>
        {merit ? <td>State</td> : null}
        <td>Policy Start</td>
        <td>Policy End</td>
        {merit ? <td>Total Loss Value</td> : <td>Loss Value by State</td>}
        {merit ? <td># Other Claims</td> : null}
        {merit ? <td># Indemnity Claims</td> : null}
      </tr>
    </thead>
  );
};

const MeritTable = props => {
  const { records, editClaim } = props;
  return (
    <div>
      <h2>Looks like this policy has some merit states.</h2>
      {records.length ? (
        <p>Enter claims information, by year, for each state listed below.</p>
      ) : (
        <p>Enter some aggregate claims info above to start setting up merit</p>
      )}
      {records.length ? (
        <table>
          <TableHeader merit={true} />
          <tbody>
            {records.map(record => (
              <TableRow
                key={record.id}
                record={record}
                merit={true}
                editClaim={editClaim}
              />
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

const AggregateTable = props => {
  const { addRecord, records } = props;
  return (
    <div>
      <h2>Annual Claims Profile</h2>
      <p>
        Enter the total value of claims, by policy period, for the insured while
        they were with another, lesser carrier.
      </p>
      <table>
        <TableHeader />
        <tbody>
          <TableRowEmpty button="true" addRecord={addRecord} />
          {records.map(record => <TableRow key={record.id} record={record} />)}
        </tbody>
      </table>
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      records: [],
      meritRecords: [],
      meritStates: ['AL'],
      merit: false
    };

    this.addRecord = this.addRecord.bind(this);
    this.clearEntry = this.clearEntry.bind(this);
    this.editClaim = this.editClaim.bind(this);
    this.syncMerit = this.syncMerit.bind(this);
    this.handleChange_next = this.handleChange_next.bind(this);
  }

  componentWillMount() {
    this.state.meritStates.length ? this.setState({ merit: true }) : null;
  }

  handleChange_next() {
    if (document.getElementById('policyStart').value.length !== 0) {
      this.setState({ records: this.addRecord() }, () =>
        this.syncMerit(this.state.records)
      );
      this.clearEntry();
    }
  }

  addRecord() {
    return [
      {
        id: Math.floor(Math.random() * 10000) + 1,
        policyStart: document.getElementById('policyStart').value,
        policyEnd: document.getElementById('policyEnd').value,
        lossValue: document.getElementById('lossValue').value
      },
      ...this.state.records
    ];
  }

  syncMerit(records) {
    const updatedMerit = [];
    this.state.meritStates.forEach(state => {
      records.forEach(record => {
        updatedMerit.push({
          id: `${record.id}-${state}`,
          state: state,
          policyStart: record.policyStart,
          policyEnd: record.policyEnd,
          lossValue: record.lossValue,
          otherClaims: 0,
          indemnityClaims: 0
        });
      });
    });
    this.setState({ meritRecords: updatedMerit });
  }

  editClaim(id) {
    const recordIndex = this.state.meritRecords.indexOf(
      this.state.meritRecords.find(obj => obj.id === id)
    );
  }

  clearEntry() {
    document.getElementById('policyStart').value = '';
    document.getElementById('policyEnd').value = '';
    document.getElementById('lossValue').value = '';
    document.getElementById('policyStart').focus();
  }

  render() {
    return (
      <div className="App">
        <AggregateTable
          records={this.state.records}
          addRecord={this.handleChange_next}
        />
        {!this.state.merit ? (
          <div>
            <h2>This policy doesn't have any merit states.</h2>
            <p>So, you just need to enter the yearly totals above. :)</p>
          </div>
        ) : null}
        {this.state.merit ? (
          <MeritTable
            records={this.state.meritRecords}
            editClaim={this.editClaim}
            merit={this.state.merit}
          />
        ) : null}
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
