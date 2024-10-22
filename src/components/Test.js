import React from 'react';
import PropTypes from 'prop-types';

export default function Test({ taco }) {
  return (
    <div>
      <h2>
        <ul>
          <li>{taco}</li>
        </ul>
      </h2>
    </div>
  );
}

Test.propTypes = {
  taco: PropTypes.string,
};
