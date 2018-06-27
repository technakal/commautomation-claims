import React from 'react';

const MeritSelector = props => {
  const { toggleMerit, meritStates, meritOpen } = props;
  const merit = [];
  meritStates.forEach(state => {
    if (state.active) {
      merit.push(state.state);
    }
  });
  return (
    <div className={meritOpen ? 'merit-menu' : 'merit-menu open'}>
      <button
        className={merit.includes('AL') ? 'enabled' : null}
        onClick={() => toggleMerit('AL')}>
        AL
      </button>
      <button
        className={merit.includes('MI') ? 'enabled' : null}
        onClick={() => toggleMerit('MI')}>
        MI
      </button>
      <button
        className={merit.includes('OK') ? 'enabled' : null}
        onClick={() => toggleMerit('OK')}>
        OK
      </button>
      <button
        className={merit.includes('OR') ? 'enabled' : null}
        onClick={() => toggleMerit('OR')}>
        OR
      </button>
      <button
        className={merit.includes('SD') ? 'enabled' : null}
        onClick={() => toggleMerit('SD')}>
        SD
      </button>
      <button
        className={merit.includes('TX') ? 'enabled' : null}
        onClick={() => toggleMerit('TX')}>
        TX
      </button>
    </div>
  );
};

export default MeritSelector;
