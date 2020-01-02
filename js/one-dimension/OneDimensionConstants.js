// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author UTFPR
 */
define( require => {
  'use strict';

  // modules
  const normalModes = require( 'NORMAL_MODES/normalModes' );

  const OneDimensionConstants = {

    SCREEN_VIEW_X_MARGIN: 15,
    SCREEN_VIEW_Y_MARGIN: 15,

    MIN_SPEED: 0.25,
    INIT_SPEED: 1,
    MAX_SPEED: 3,
    DELTA_SPEED: 0.1,

    MIN_MODE_AMPLITUDE: 0,
    INIT_MODE_AMPLITUDE: 0,
    MAX_MODE_AMPLITUDE: 10, /* TODO experimentar e trocar como necessario Franco */

    MIN_MODE_PHASE: -Math.PI,
    INIT_MODE_PHASE: 0,
    MAX_MODE_PHASE: Math.PI

    //TODO
  };

  return normalModes.register( 'OneDimensionConstants', OneDimensionConstants );
} );