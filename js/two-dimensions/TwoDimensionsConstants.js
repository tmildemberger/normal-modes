// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author UTFPR
 */
define( require => {
  'use strict';
  
  const NormalModesConstants = require( 'NORMAL_MODES/common/NormalModesConstants' );

  // modules
  const normalModes = require( 'NORMAL_MODES/normalModes' );

  /* as the default distances between masses decrease a lot, the max amplitudes must be smaller */
  const maxAmplitudes = new Array( NormalModesConstants.MAX_MASSES_ROW_LEN );
  
  let baseMaxAmplitude = .45;
  for( let i = 0; i < maxAmplitudes.length; i++ ) {
    maxAmplitudes[ i ] = baseMaxAmplitude / ( i + 1 ); // this way of calculating maxAplitudes gives very similar behaviour to the original sim
  }

  const TwoDimensionsConstants = {

    SCREEN_VIEW_X_MARGIN: 15,
    SCREEN_VIEW_Y_MARGIN: 15,

    MIN_SPEED: 0.02,
    INIT_SPEED: 1,
    MAX_SPEED: 3,
    DELTA_SPEED: 0.1,

    MIN_MODE_AMPLITUDE: 0,
    INIT_MODE_AMPLITUDE: 0,
    MAX_MODE_AMPLITUDE: maxAmplitudes, /* TODO experimentar e trocar como necessario Franco */

    MIN_MODE_PHASE: -Math.PI,
    INIT_MODE_PHASE: 0,
    MAX_MODE_PHASE: Math.PI,

    MASSES_MASS_VALUE: 0.1,
    SPRING_CONSTANT_VALUE: 0.1 * 4 * Math.PI ** 2,

    LEFT_WALL_X_POS: -1,
    DISTANCE_BETWEEN_X_WALLS: 2,
    TOP_WALL_Y_POS: 1,
    DISTANCE_BETWEEN_Y_WALLS: 2,

    FPS: 60,
    FIXED_DT: 1 / 60

    //TODO
  };

  return normalModes.register( 'TwoDimensionsConstants', TwoDimensionsConstants );
} );