import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

const TableRow = props => {
  const { policyStart, policyEnd, lossValue } = props.record;
  return (
    <tr>
      <td>{policyStart}</td>
      <td>{policyEnd}</td>
      <td>{lossValue}</td>
    </tr>
  );
};

const TableRowEmpty = props => {
  const { button, onClick } = props;
  return (
    <tr>
      <td>
        <input type="date" id="policyStart" />
      </td>
      <td>
        <input type="date" id="policyEnd" />
      </td>
      <td>
        <input type="number" min="1" id="lossValue" />
      </td>
      <td>
        <button onClick={onClick}>Add Record</button>
      </td>
    </tr>
  );
};

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <td>Policy Start</td>
        <td>Policy End</td>
        <td>Total Loss Value</td>
      </tr>
    </thead>
  );
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      records: []
    };

    this.addRecord = this.addRecord.bind(this);
    this.clearEntry = this.clearEntry.bind(this);
  }

  addRecord() {
    if (document.getElementById('policyStart').value.length) {
      this.setState({
        records: [
          {
            id: Math.floor(Math.random() * 10000) + 1,
            policyStart: document.getElementById('policyStart').value,
            policyEnd: document.getElementById('policyEnd').value,
            lossValue: document.getElementById('lossValue').value
          },
          ...this.state.records
        ]
      });
    }
    this.clearEntry();
  }

  clearEntry() {
    document.getElementById('policyStart').value = '';
    document.getElementById('policyEnd').value = '';
    document.getElementById('lossValue').value = '';
    document.getElementById('policyStart').focus();
  }

  render() {
    return (
      <table>
        <TableHeader />
        <tbody>
          <TableRowEmpty button="true" onClick={this.addRecord} />
          {this.state.records.map(record => (
            <TableRow key={record.id} record={record} />
          ))}
        </tbody>
      </table>
    );
  }
}

const App = () => {
  return (
    <div className="App">
      <Table />
    </div>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
