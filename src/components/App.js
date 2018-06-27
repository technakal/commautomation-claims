import React, { Component } from 'react';
import { AggregateTable, MeritTable } from './Tables';
import Modal from './Modal';
import MeritPicker from './MeritPicker';
import logo from '../img/logo.png';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      records: [],
      meritRecords: [],
      meritStates: [
        { state: 'AL', active: false },
        { state: 'MI', active: false },
        { state: 'OK', active: false },
        { state: 'OR', active: false },
        { state: 'SD', active: false },
        { state: 'TX', active: false }
      ],
      merit: false,
      modalVisible: false,
      pendingDeleteId: null,
      meritOpen: true
    };

    this.toggleMerit = this.toggleMerit.bind(this);
    this.addNewAggregate = this.addNewAggregate.bind(this);
    this.clearEntry = this.clearEntry.bind(this);
    this.editClaim = this.editClaim.bind(this);
    this.deleteClaim = this.deleteClaim.bind(this);
    this.requestDelete = this.requestDelete.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.syncMerit = this.syncMerit.bind(this);
  }

  componentWillMount() {
    this.checkMerit();
  }

  toggleMerit(state) {
    const meritStates = this.state.meritStates;
    const inMeritIndex = meritStates.indexOf(
      meritStates.find(obj => obj.state === state)
    );
    meritStates[inMeritIndex].active = !meritStates[inMeritIndex].active;
    this.setState({ meritStates: meritStates }, () => this.checkMerit());
  }

  checkMerit() {
    const meritStates = this.state.meritStates;
    const meritApplies = [];
    meritStates.forEach(state => {
      if (state.active) {
        meritApplies.push(true);
      }
    });
    meritApplies.includes(true)
      ? this.setState({ merit: true }, () => this.syncMerit())
      : this.setState({ merit: false }, () => this.syncMerit());
  }

  addNewAggregate() {
    if (document.getElementById('policyStart').value !== '') {
      const records = this.state.records;
      records.push({
        id: Math.floor(Math.random() * 10000) + 1,
        policyStart: document.getElementById('policyStart').value,
        policyEnd: document.getElementById('policyEnd').value,
        lossValue: document.getElementById('lossValue').value
      });
      this.setState({ records: records }, () => this.syncMerit());
      this.clearEntry();
    }
  }

  syncMerit() {
    const updatedMerit = [];
    this.state.meritStates.forEach(state => {
      if (state.active) {
        this.state.records.forEach(record => {
          updatedMerit.push({
            id: `${record.id}-${state.state}`,
            state: state.state,
            policyStart: record.policyStart,
            policyEnd: record.policyEnd,
            lossValue: '',
            otherClaims: '',
            indemnityClaims: ''
          });
        });
      }
    });
    this.setState({ meritRecords: updatedMerit });
  }

  editClaim(id) {
    const meritRecords = this.state.meritRecords;
    const originalId = id.split('-')[0];
    const recordIndex = this.state.meritRecords.indexOf(
      this.state.meritRecords.find(obj => obj.id === id)
    );
    meritRecords[recordIndex].lossValue = Number(
      document.getElementById(`${id}-lv`).value
    );
    meritRecords[recordIndex].otherClaims = Number(
      document.getElementById(`${id}-oc`).value
    );
    meritRecords[recordIndex].indemnityClaims = Number(
      document.getElementById(`${id}-ic`).value
    );
    this.setState({ meritRecords: meritRecords }, () => this.syncMerit());
  }

  requestDelete(id) {
    this.setState({ modalVisible: true, pendingDeleteId: id });
  }

  closeModal() {
    this.setState({ modalVisible: false, pendingDeleteId: null });
  }

  deleteClaim() {
    const recordIndex = this.state.records.indexOf(
      this.state.records.find(obj => obj.id === this.state.pendingDeleteId)
    );
    const records = this.state.records;
    records.splice(recordIndex, 1);
    this.setState({ records: records }, () => this.syncMerit());
    this.closeModal();
  }

  clearEntry() {
    document.getElementById('policyStart').value = '';
    document.getElementById('policyEnd').value = '';
    document.getElementById('lossValue').value = '';
    document.getElementById('policyStart').focus();
  }

  render() {
    return (
      <div>
        {this.state.modalVisible ? (
          <div className="modal-overlay">
            <Modal
              title="Delete Claim?"
              text="Are you sure you want to delete this claim? This action is forever."
              onConfirm={this.deleteClaim}
              onCancel={this.closeModal}
            />
          </div>
        ) : null}
        <div className="App">
          <MeritPicker
            meritOpen={this.state.meritOpen}
            toggleMerit={this.toggleMerit}
            meritStates={this.state.meritStates}
          />
          <button
            className="merit-menu-button"
            onClick={() => this.setState({ meritOpen: !this.state.meritOpen })}>
            {this.state.meritOpen ? 'Close Merit Menu' : 'Open Merit Menu'}
          </button>
          <header className="header">
            <img src={logo} alt="logo" />
            <h1>Prior Carrier Claims Prototype</h1>
          </header>
          <AggregateTable
            records={this.state.records}
            deleteClaim={this.requestDelete}
            addRecord={this.addNewAggregate}
          />
          {!this.state.merit ? (
            <div>
              <h3>This policy doesn't have any merit states.</h3>
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
      </div>
    );
  }
}

export default App;
